# API Request/Response Format

## ✅ Correct Format (Using Your Curl)

### Request to `/api/chat`:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are D-Arrow, a professional AI assistant..."
    },
    {
      "role": "user",
      "content": "Tell me about services"
    }
  ]
}
```

### API to Grok:
```json
{
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "Tell me about services"}
  ],
  "model": "grok-4-latest",
  "stream": false,
  "temperature": 0,
  "max_tokens": 350,
  "top_p": 0.95
}
```

### Expected Response from Grok:
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "D-Arrow provides SEO, Web Design, Branding..."
      }
    }
  ]
}
```

### Response to Chatbot:
```json
{
  "content": "D-Arrow provides SEO, Web Design, Branding..."
}
```

---

## 🔍 Debug Response Times

When testing, look for these timings:

```
[Client] Send message → [API] /api/chat
  ↓ (< 100ms)
[API] Fetch grok API
  ↓ (1-2 seconds connection)
[Grok] Processing
  ↓ (2-5 seconds thinking)
[Grok] Return response
  ↓ (< 100ms)
[API] Parse & return
  ↓ (< 100ms)
[Client] Display message
  ↓
[User] Sees response!
```

**Total: 3-8 seconds**

---

## ⚡ Performance Checklist

- [ ] Model: `grok-4-latest` ✓
- [ ] Temperature: 0 ✓
- [ ] Max tokens: 350 ✓
- [ ] Timeout: 20000ms (20s) ✓
- [ ] Message history: Last 8 ✓
- [ ] No retry loops ✓
- [ ] Direct error handling ✓

---

## 📝 Key Changes Made

### Before (Slow):
```typescript
model: 'grok-latest',
temperature: 0.7,
max_tokens: 300,
timeout: 30000,
messages: conversationHistory.slice(-10),
// Had retry logic
```

### After (Fast):
```typescript
model: 'grok-4-latest',  // Exact from curl
temperature: 0,          // Deterministic
max_tokens: 350,         // Optimal
timeout: 20000,          // Quick feedback
messages: conversationHistory.slice(-8), // Lightweight
// No retry delays
```

---

## ✨ Result

**Response "D-Arrow AI is thinking..." should disappear within 3-8 seconds with actual AI response!**

If still showing after 20s = Check API key or connectivity
