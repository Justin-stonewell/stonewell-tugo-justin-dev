/**
 * @typedef {Object} QuotePerson
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate // YYYY-MM-DD
 * @property {string=} gender
 */

/**
 * @typedef {Object} QuoteForm
 * @property {string} residenceCountry
 * @property {string=} province
 * @property {string} startDate // YYYY-MM-DD
 * @property {string} endDate   // YYYY-MM-DD
 * @property {QuotePerson[]} insuredPersons
 * @property {boolean=} isFamilyPlan
 * @property {number=} deductible
 * @property {number[]=} tripCosts
 * @property {boolean=} preExisting
 */

/**
 * @typedef {Object} NormalizedQuote
 * @property {"tugo_api"|"db_fallback"} source
 * @property {string} currency
 * @property {number} premium
 * @property {number} taxes
 * @property {number} total
 * @property {number} deductible
 * @property {string} productCode
 * @property {{ medicalLimit: number, tripCancel?: number, tripInterrupt?: number }} coverages
 */
