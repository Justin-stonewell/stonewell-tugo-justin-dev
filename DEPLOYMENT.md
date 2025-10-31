# Netlify Deploy Preview Setup

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Local development:**
   ```bash
   npx netlify dev
   ```
   This should start on http://localhost:8888

## Environment Variables for Netlify

Set these in Netlify Dashboard → Site Settings → Environment Variables:

### Required for Deploy Preview
- `TUGO_API_BASE_URL` - TuGo API base URL (e.g., `https://api.tugo.com`)
- `TUGO_TOKEN_URL` - TuGo token endpoint (optional, defaults to `${TUGO_API_BASE_URL}/v1/venture/accessToken`)
- `TUGO_CLIENT_ID` - TuGo API client ID
- `TUGO_CLIENT_SECRET` - TuGo API client secret
- `TUGO_USER_NAME` - TuGo username
- `TUGO_PASSWORD` - TuGo password
- `TUGO_PARTNER_CODE` - Partner code (defaults to "SFS000" if not set)
- `TUGO_PRODUCT_LINE_CODE` - Product line code (defaults to "PR-FDM-1" if not set)

### Build-time flags
- `REACT_APP_USE_NETLIFY_FUNCTIONS` - Set to `"true"` (already in netlify.toml)
- `USE_TUGO_API_PRICING` - Set to `"true"` (already in netlify.toml)
- `REACT_APP_API_URL` - Optional, leave empty to use Netlify Functions

### Optional
- `QUOTE_API_TIMEOUT_MS` - Timeout for quote requests (defaults to 8000ms)
- `QUOTE_API_CACHE_TTL_SEC` - Cache TTL in seconds

## Deploy Preview Setup

1. **Push your branch:**
   ```bash
   git checkout -b fix/tugo-quote-stability
   git add .
   git commit -m "Fix TuGo quote stability and Node 20 OpenSSL issue"
   git push origin fix/tugo-quote-stability
   ```

2. **Create Pull Request** - Netlify will automatically create a Deploy Preview

3. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add all the TuGo credentials listed above
   - Make sure they are available for "Deploy previews"

4. **Trigger a new deploy** if needed (Netlify should auto-deploy on PR)

## Testing Step 3 in Deploy Preview

1. Open the Deploy Preview URL from your PR
2. Navigate through the travel insurance application flow:
   - Step 1: Trip Period
   - Step 2: Applicants
   - Step 3: **Your Insurance** (Product Selection)
3. In Step 3:
   - Click the quote button or trigger the TuGo quote
   - Expected behavior:
     - **Success case:** Should display TuGo premium/plans
     - **Failure case:** Should display premium=0 (fallback) without crashing
     - Should still be able to click "Next" to proceed to Step 4 (Contact/Payment)
4. Verify:
   - ✅ No browser console errors
   - ✅ No app freezing/crashing
   - ✅ Can proceed past Step 3 even if TuGo fails
   - ✅ Premium shows as $0.00 when TuGo fails (instead of crashing)

## Notes

- The `tugoQuote` function now returns `statusCode: 200` with a fallback response when TuGo fails
- The front-end handles the fallback gracefully and shows premium=0
- The app will no longer freeze when TuGo API fails or returns errors

