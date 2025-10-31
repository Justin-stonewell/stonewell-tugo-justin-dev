const handler = require('../../netlify/functions/tugoQuote');

describe('tugoQuote Netlify function', () => {
  test('returns 400 on invalid input', async () => {
    const event = { httpMethod: 'POST', headers: {}, body: JSON.stringify({}) };
    const res = await handler.handler(event);
    expect(res.statusCode).toBe(400);
  });
});
