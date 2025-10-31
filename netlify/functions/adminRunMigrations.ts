import type { Handler } from '@netlify/functions'
import { query } from './_db'
import fs from 'fs'
import path from 'path'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  const adminToken = process.env.ADMIN_TASK_TOKEN || ''
  const headerToken = (event.headers['x-admin-token'] || event.headers['X-Admin-Token'] || '') as string
  if (!adminToken || headerToken !== adminToken) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const engine = (process.env.DB_ENGINE || 'postgres').toLowerCase()
  try {
    const fileRel = engine === 'mysql'
      ? 'db/migrations/001_add_quote_snapshot_columns_mysql.sql'
      : 'db/migrations/001_add_quote_snapshot_columns_postgres.sql'
    const filePath = path.resolve(process.cwd(), fileRel)
    const sql = fs.readFileSync(filePath, 'utf8')

    if (engine === 'mysql') {
      // TODO: Implement MySQL execution path (mysql2/promise). For now, return not implemented for MySQL.
      return {
        statusCode: 501,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, engine: 'mysql', error: 'MySQL execution not implemented in Functions. Run the provided SQL manually.' }),
      }
    }

    // Postgres execution
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    await query('BEGIN')
    let executed = 0
    try {
      for (const stmt of statements) {
        await query(stmt)
        executed += 1
      }
      await query('COMMIT')
    } catch (e) {
      await query('ROLLBACK')
      throw e
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, engine: 'postgres', statementsExecuted: executed }),
    }
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, engine, error: e.message }),
    }
  }
}
