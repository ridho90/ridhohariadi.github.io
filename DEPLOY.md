# Deploy Guide — Portfolio AI Assistant

## ✅ Worker Already Deployed

The Cloudflare Worker is live at:
```
https://portfolio-agent.ridho90.workers.dev
```

**Gemini API Key** sudah di-set sebagai secret. Saat ini free tier quota sudah terpakai untuk hari ini, tapi akan reset otomatis. Jika ingin quota lebih tinggi, upgrade ke API key dengan billing di https://aistudio.google.com/apikey

## Step 1: Deploy Worker (Only if you need to update)

### Option A: Deploy with single curl command

```bash
cd "/Users/ridhohariadi/Downloads/KERJA/web porto/portfolio-v2"

# Upload worker code
curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/e6d25b5f997dd2a3d48849881c4d72ad/workers/scripts/portfolio-agent" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "metadata={\"body_part\":\"script\"};type=application/json" \
  -F "script=@worker-service.js;type=application/javascript"
```

### Option B: Cloudflare Dashboard (Manual)

1. Go to https://dash.cloudflare.com/ → Workers & Pages
2. Click `portfolio-agent`
3. Click "Edit Code"
4. Paste the content of `worker-service.js`
5. Click "Save and Deploy"
6. To update the Gemini API key: Settings → Variables → Edit `GEMINI_API_KEY`

## Step 2: Worker URL

Already set in `index.html`:
```
https://portfolio-agent.ridho90.workers.dev
```


## Step 3: Deploy Website to Netlify (No Public Repo Needed)

1. Go to https://netlify.com
2. Login with GitHub/Gmail/Email
3. Drag and drop the `portfolio-v2/` folder onto the Netlify dashboard
4. Wait for deployment (1-2 minutes)
5. Netlify gives you a URL like: `random-name.netlify.app`

### Custom Domain (Optional)

1. In Netlify → Site Settings → Domain Management
2. Add custom domain: `ridhohariadi.netlify.app`

## Step 4: Test the AI Assistant

1. Open your website
2. Scroll to the Contact section
3. Type a question like: "What is Ridho's healthcare experience?"
4. Click "Ask AI"
5. You should get a response within 2-3 seconds

## Troubleshooting

| Problem | Solution |
|---------|----------|
| AI says "not configured" | Check GEMINI_API_KEY secret is set in Cloudflare Worker |
| AI returns error 500 | Check Worker code for syntax errors |
| CORS error | Worker already has CORS headers configured |
| No response from AI | Check Worker URL in index.html matches deployed URL |
