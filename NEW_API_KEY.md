# 🔑 Generate New Grok API Key

## If Current Key Shows 403/401 Error

The API key might be **expired** or **revoked**. Follow these steps to generate a new one:

---

## ✅ Step 1: Access X.AI Console

1. **Go to:** https://console.x.ai
2. **Login** with your X.AI account
   - If no account: Create one at https://x.ai

---

## ✅ Step 2: Get New API Key

Navigate to:
- **Dashboard** → **API Keys** (or similar)
- Click **"Create API Key"** or **"New Key"**
- Give it a name like: `D-Arrow-Chatbot`
- **Copy the key** (looks like: `xai-abc123...xyz`)

⚠️ **Important:** Copy immediately - usually can't view again!

---

## ✅ Step 3: Update .env.local

1. **Open file:**
   ```
   c:\Users\yusuf\OneDrive\Desktop\digital marketing-1\main\.env.local
   ```

2. **Find line 14:**
   ```
   GROK_API_KEY=xai-YOUR_API_KEY_HERE
   ```

3. **Replace with new key:**
   ```
   GROK_API_KEY=xai-YOUR_NEW_KEY_HERE
   ```

4. **Save** (Ctrl+S)

---

## ✅ Step 4: Update Vercel (If Deployed)

If your site is on Vercel:

1. Go: https://vercel.com/dashboard/projects
2. Select your project
3. **Settings** → **Environment Variables**
4. Find `GROK_API_KEY`
5. **Edit** it with new key
6. **Save** - Vercel redeploys automatically

---

## ✅ Step 5: Test New Key

### Local Test:
```bash
cd "c:\Users\yusuf\OneDrive\Desktop\digital marketing-1\main"
npm run dev
```

Then click chat button and ask a question.

### Or Run Test Script:
```bash
test-api-key.bat
```

Should show: ✓ API Connection: SUCCESS

---

## 🎯 Expected Result

After updating key:
- ✅ Chatbot responds in 3-8 seconds
- ✅ No "authentication failed" error
- ✅ Messages appear in chat

---

If still getting errors, verify:
- [ ] Key copied exactly (no spaces)
- [ ] Key starts with `xai-`
- [ ] Dev server restarted
- [ ] Vercel env var updated (if deployed)
