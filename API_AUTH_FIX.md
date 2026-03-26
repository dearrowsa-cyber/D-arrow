# 🔐 API Authentication Failed - Troubleshooting Guide

## ❌ Problem
```
"API authentication failed"
Status: 403 (Forbidden) or 401 (Unauthorized)
```

---

## ✅ Solution - Step by Step

### **Step 1: Verify API Key Format**

✅ Should look like:
```
xai-YOUR_API_KEY_HERE
```

**Current key in .env.local:**
```
GROK_API_KEY=xai-YOUR_API_KEY_HERE
```

✅ **Format correct** - Starts with `xai-`

---

### **Step 2: Check if API Key is Expired**

Your API key might be expired or revoked. **Action Required:**

1. **Go to:** https://console.x.ai
2. **Login** with your X.AI account
3. **Check API Keys section** for your active keys
4. **If expired:** Delete old key and create a new one
5. **Copy new key** exactly as displayed

---

### **Step 3: Update API Key (If New)**

If you have a new API key:

1. **Open:** `.env.local`
2. **Replace line 14 with:**
   ```
   GROK_API_KEY=xai-YOUR_NEW_KEY_HERE
   ```
3. **Save file** (Ctrl+S)
4. **Restart dev server** or redeploy

---

### **Step 4: Test API Key Directly**

**Run this PowerShell command to test:**

```powershell
$apiKey = "xai-YOUR_API_KEY_HERE"

$body = @{
    messages = @(
        @{role="system"; content="Say hello"}
        @{role="user"; content="Hi"}
    )
    model = "grok-4-latest"
    stream = $false
    temperature = 0
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $apiKey"
}

$response = Invoke-WebRequest -Uri "https://api.x.ai/v1/chat/completions" `
    -Method POST -Headers $headers -Body $body -ErrorAction Continue

if ($response.StatusCode -eq 200) {
    Write-Host "✅ API Key VALID!" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} else {
    Write-Host "❌ API Key INVALID - Status: $($response.StatusCode)" -ForegroundColor Red
    Write-Host $response.Content
}
```

**What to look for:**
- ✅ **"✅ API Key VALID!"** = Key is working
- ❌ **403/401 error** = Key is invalid/expired
- ❌ **"401 Unauthorized"** = Wrong or missing API key

---

### **Step 5: Check Server Logs (Local Dev)**

Run this to see detailed errors:

```bash
cd "c:\Users\yusuf\OneDrive\Desktop\digital marketing-1\main"
npm run dev
```

Then open chatbot and try to send a message. **Watch the terminal** for error output:

```
🔐 Using API key: xai-abc...xyz
📤 Sending request to Grok API...
📥 API Response Status: 403
❌ API Error (403): {"error":{"message":"Invalid API key"}}
```

---

## 🔍 Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 403 Forbidden | Invalid/expired key | Get new key from console.x.ai |
| 401 Unauthorized | Missing/malformed key | Check .env.local format |
| 429 Too Many Requests | Rate limited | Wait 1 minute, try again |
| Socket hangup | API server down | Wait and retry |

---

## 🚀 Deploy After Fixing

**If using Vercel:**

1. **Add new API key to Vercel:**
   - Go to: https://vercel.com/dashboard
   - Project Settings → Environment Variables
   - Update: `GROK_API_KEY=xai-YOUR_NEW_KEY`

2. **Push changes:**
   ```bash
   git add .env.local app/api/chat/route.ts
   git commit -m "Fix: Update API key and improve error logging"
   git push
   ```

3. **Vercel auto-deploys** - Wait 1-2 minutes

---

## ✨ Verify It Works

After fixing:

1. **Local test:**
   ```bash
   npm run dev
   ```
   - Open https://www.d-arrow.com/
   - Click chat, ask a question
   - Should respond in 3-8 seconds

2. **Check console (F12):**
   - Open DevTools
   - Go to Console tab
   - Should NOT see any errors

3. **Live test (Vercel):**
   - Visit your live site
   - Test chatbot
   - Should work same as local

---

## 📝 Checklist

- [ ] API key format starts with `xai-`
- [ ] API key is not expired
- [ ] API key is in `.env.local`
- [ ] API key added to Vercel env vars
- [ ] Tested with PowerShell command
- [ ] Local test works (npm run dev)
- [ ] Server logs show "✅ API Success"
- [ ] Chatbot responds in 3-8 seconds

---

## 📞 If Still Not Working

Check:
1. Is API key copied exactly with no spaces?
2. Did you save .env.local?
3. Did you restart dev server?
4. Is network connected?
5. Check API key expiration date

**Most likely cause:** API key expired - generate new one from console.x.ai
