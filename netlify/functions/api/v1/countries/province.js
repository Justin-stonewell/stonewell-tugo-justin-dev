// Mock province endpoint for Netlify Deploy Preview
exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
    data: {
      rows: [
        { code: 'ON', name: 'Ontario' },
        { code: 'BC', name: 'British Columbia' },
        { code: 'AB', name: 'Alberta' },
        { code: 'QC', name: 'Quebec' },
        { code: 'MB', name: 'Manitoba' },
        { code: 'SK', name: 'Saskatchewan' },
        { code: 'NS', name: 'Nova Scotia' },
        { code: 'NB', name: 'New Brunswick' },
        { code: 'NL', name: 'Newfoundland and Labrador' },
        { code: 'PE', name: 'Prince Edward Island' },
        { code: 'YT', name: 'Yukon' },
        { code: 'NT', name: 'Northwest Territories' },
        { code: 'NU', name: 'Nunavut' },
      ],
    },
  }),
});

