# Netlify Environment Variables Checklist

## Required Environment Variables for Deploy Preview

The following environment variables must be set in **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

### TuGo API Credentials
- `TUGO_API_BASE_URL` - TuGo API base URL (e.g., `https://api.tugo.com`)
- `TUGO_TOKEN_URL` - TuGo token endpoint (optional, defaults to `${TUGO_API_BASE_URL}/v1/venture/accessToken`)
- `TUGO_CLIENT_ID` - TuGo API client ID (from your TuGo account)
- `TUGO_CLIENT_SECRET` - TuGo API client secret (from your TuGo account)
- `TUGO_USER_NAME` - TuGo username (e.g., `SFS000`)
- `TUGO_PASSWORD` - TuGo password
- `TUGO_PARTNER_CODE` - Partner code (defaults to `SFS000` if not set)
- `TUGO_PRODUCT_LINE_CODE` - Product line code (defaults to `PR-FDM-1` if not set)

### Build-time Configuration
- `REACT_APP_USE_NETLIFY_FUNCTIONS` - Set to `"true"` (already configured in netlify.toml)
- `USE_TUGO_API_PRICING` - Set to `"true"` (already configured in netlify.toml)
- `REACT_APP_API_URL` - Leave empty or unset to use Netlify Functions

### Optional Configuration
- `QUOTE_API_TIMEOUT_MS` - Timeout for quote requests in milliseconds (defaults to 8000ms)
- `QUOTE_API_CACHE_TTL_SEC` - Cache TTL in seconds (if using caching)

## Setting Environment Variables in Netlify

1. Go to **Netlify Dashboard** → Select your site
2. Navigate to **Site Settings** → **Environment Variables**
3. Click **Add a variable** for each variable listed above
4. **Important:** Set the scope to include **"Deploy previews"** (or **"All deploys"**) so they're available in Deploy Previews
5. Save each variable

## After Setting Variables

1. Trigger a new deploy by:
   - Pushing a new commit to the branch, OR
   - Manually triggering a deploy from Netlify Dashboard

2. Verify variables are available:
   - Check the deploy logs in Netlify Dashboard
   - The build should complete successfully
   - Functions should be able to access the environment variables

## Testing

Once the Deploy Preview is live:
1. Open the Deploy Preview URL
2. Navigate to Step 3 ("Your Insurance")
3. Trigger a TuGo quote
4. Verify:
   - ✅ TuGo quote returns successfully (if credentials are valid)
   - ✅ Or shows fallback premium=0 if TuGo fails (without crashing)
   - ✅ Can proceed past Step 3 regardless of quote result

