# N8N Chatbot Setup Guide

## Overview
The application includes an integrated N8N chatbot that appears on all pages. This guide explains how to set it up and verify it's working correctly.

## Configuration

### Environment Variables
The chatbot requires one environment variable to function:

```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://yusufiqb.app.n8n.cloud/webhook/2e7c652e-a000-4aa2-9368-47cf243f0f3e/chat
```

**Important:** This is a public variable (prefixed with `NEXT_PUBLIC_`) so it's available in the browser. Keep your actual webhook URL secure.

### Files Involved
- **[.env.local](.env.local)** - Local development configuration (already configured)
- **[.env.local.example](.env.local.example)** - Example with production webhook URL
- **[components/N8nChatbot.tsx](components/N8nChatbot.tsx)** - Main chatbot component
- **[components/ClientLayout.tsx](components/ClientLayout.tsx)** - Integrates chatbot into layout

## How It Works

### Component Integration
The `N8nChatbot` component is loaded in `ClientLayout.tsx` and runs on all pages of the application:

```tsx
<N8nChatbot />
```

### Initialization Process
1. Component detects if webhook URL is configured
2. If URL is missing or invalid, logs a warning (doesn't break the app)
3. Loads N8N chat stylesheet from CDN
4. Loads N8N chat bundle and initializes with webhook URL
5. Chat widget appears on bottom-right of the page

## Development

### Run in Development Mode
```bash
npm run dev
```

The application will start on `https://www.d-arrow.com/`. The chatbot should initialize silently. Check the browser console for any messages:
- ✅ Success: `✅ N8N Chatbot initialized successfully`
- ⚠️ Warning: `⚠️ N8N Chatbot: Webhook URL not configured...`
- ❌ Error: `Error initializing N8N Chatbot:...`

### Testing
1. Start the dev server: `npm run dev`
2. Open `https://www.d-arrow.com/` in your browser
3. Open DevTools (F12) → Console tab
4. Look for initialization messages
5. You should see a chat icon on the bottom-right of the page

## Deployment

### Vercel Deployment
When deploying to Vercel, you must add the environment variable:

1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL = https://yusufiqb.app.n8n.cloud/webhook/2e7c652e-a000-4aa2-9368-47cf243f0f3e/chat
   ```
4. Redeploy the project

### Other Hosting
Add the `NEXT_PUBLIC_N8N_WEBHOOK_URL` environment variable to your hosting provider's configuration.

## Troubleshooting

### Chatbot Not Appearing
1. **Check Console** - Open DevTools (F12) and look for error messages
2. **Verify Environment Variable** - Ensure `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set correctly
3. **Check Webhook URL** - The URL should start with `https://` and include the webhook ID
4. **Check N8N Status** - Verify the N8N instance is running and the webhook is active

### Common Issues

#### "Webhook URL not configured"
- The environment variable is missing or contains the placeholder text
- **Fix:** Update `.env.local` with the real webhook URL

#### "Failed to load N8N chat stylesheet/script"
- CDN might be down or blocked
- **Fix:** Check browser network tab for failed requests
- Clear browser cache and reload

#### Chat widget appears but doesn't respond
- The webhook URL is invalid or the N8N workflow is inactive
- **Fix:** Test the webhook URL directly in N8N > Workflow > Test

## Configuration Details

### Webhook URL Format
```
https://{n8n-instance}/webhook/{webhook-id}/chat
```

### Where to Get Your Webhook URL
1. Log into your N8N instance
2. Open the workflow with your chat configuration
3. Find the Webhook trigger node
4. Click "Copy webhook URL"
5. Use this URL as `NEXT_PUBLIC_N8N_WEBHOOK_URL`

### N8N Workflow Requirements
Your N8N workflow should:
- Have a Webhook trigger configured for POST requests
- Accept chat messages in the request body
- Return chat responses in the response
- Handle message routing and processing

## Component API

The `N8nChatbot` component has minimal configuration options. It reads from:
- `process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL` - The webhook URL

The component automatically:
- Loads required CDN resources
- Validates webhook URL
- Handles initialization errors
- Cleans up resources on unmount

## Browser Support
The N8N chat library supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Notes
- Chat resources are loaded asynchronously
- Non-blocking: If chatbot fails to load, the app continues working
- CSS is loaded via CDN before script
- Scripts load in background after DOM is ready

## Security Notes
- The webhook URL is public (visible in browser code)
- N8N handles authentication at the workflow level
- Don't expose sensitive data in webhook URLs
- Use environment variables to manage URLs across environments

## Support
For issues with:
- **N8N Setup** - [N8N Documentation](https://docs.n8n.io)
- **Chat Widget** - [N8N Chat Docs](https://docs.n8n.io/integrations/chat/)
- **This Implementation** - Check browser console logs

Last Updated: 2024
