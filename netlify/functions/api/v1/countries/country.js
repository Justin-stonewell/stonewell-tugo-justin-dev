// Mock country endpoint for Netlify Deploy Preview
exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({
    data: {
      rows: [
        { code: 'CA', name: 'Canada' },
        { code: 'US', name: 'United States' },
      ],
    },
  }),
});

