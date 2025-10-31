import { z } from 'zod'

export const QuoteSnapshotSchema = z.object({
  quotedPremium: z.number(),
  quotedTaxes: z.number(),
  quotedTotal: z.number(),
  quotedCurrency: z.string(),
  quotedProductCode: z.string(),
  quotePayloadHash: z.string(),
  quoteSource: z.enum(['tugo_api', 'db_fallback']),
  quoteAt: z.string(),
  priceOverrideReason: z.string().optional(),
})

export const ApplicationCreateSchema = z.object({
  contactEmail: z.string().email(),
  startDate: z.string(),
  endDate: z.string(),
  quotedPremium: z.number().optional(),
  quotedTaxes: z.number().optional(),
  quotedTotal: z.number().optional(),
  quotedCurrency: z.string().optional(),
  quotedProductCode: z.string().optional(),
  quotePayloadHash: z.string().optional(),
  quoteSource: z.enum(['tugo_api', 'db_fallback']).optional(),
  quoteAt: z.string().optional(),
  priceOverrideReason: z.string().optional(),
})

export type ApplicationCreate = z.infer<typeof ApplicationCreateSchema>
export type QuoteSnapshot = z.infer<typeof QuoteSnapshotSchema>

export const SellRequestSchema = z.object({
  applicationId: z.string(),
  priceOverrideReason: z.string().optional(),
})

export type SellRequest = z.infer<typeof SellRequestSchema>
