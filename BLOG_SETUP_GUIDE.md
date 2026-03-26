# Blog System Setup & Configuration Guide

## Overview
This blog system automatically generates 2 blog posts per day using the ZAI API (GLM-4.5 AI model). Posts are displayed on the blog page sorted by date and time.

## Features
- ✅ Automatic daily blog post generation (2 posts/day)
- ✅ AI-powered content using ZAI API
- ✅ Blog page with date/time sorting
- ✅ Category filtering
- ✅ Responsive design with dark theme
- ✅ Read time estimation
- ✅ RESTful API endpoints

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# ZAI API Configuration
ZAI_API_KEY=your_zai_api_key_here
ZAI_API_BASE=https://api.z.ai/v1
ZAI_MODEL=glm-4.5-air

# Blog Configuration (optional)
BLOG_API_SECRET_KEY=your_secret_key_for_api_access
CRON_SECRET=your_cron_job_secret_key
NEXT_PUBLIC_API_URL=https://www.d-arrow.com/  # For local dev
```

## API Endpoints

### 1. Get All Blog Posts
```
GET /api/blog/posts
```
Returns all blog posts sorted by date.

### 2. Generate Blog Post
```
POST /api/blog/generate
```
Generates a new blog post using ZAI API.

### 3. Blog Schedule & Auto-Posting
```
POST /api/blog/schedule
GET /api/blog/schedule
```
- **POST**: Triggers schedule check and generates post if limit not reached (max 2/day)
- **GET**: Returns schedule status

### 4. Initialize Blog System
```
POST /api/blog/init
```
Generates 2 initial blog posts to kickstart the system.

Authorization header required:
```
Authorization: Bearer {BLOG_API_SECRET_KEY}
```

### 5. Cron Job Endpoint
```
GET /api/blog/cron
POST /api/blog/cron
```
External cron job endpoint for scheduled execution.

## Setup Instructions

### Step 1: Initialize Blog System
Call the initialization endpoint to generate 2 starting posts:

```bash
curl -X POST https://www.d-arrow.com//api/blog/init \
  -H "Authorization: Bearer your_secret_key" \
  -H "Content-Type: application/json"
```

### Step 2: Set Up Cron Job for Auto-Posting

You have multiple options:

#### Option A: Using EasyCron (Recommended)
1. Go to https://www.easycron.com/
2. Create new cron job
3. URL: `https://yourdomain.com/api/blog/cron`
4. Cron Expression: `0 */12 * * *` (Every 12 hours, generates 2 posts/day)
5. HTTP Method: GET
6. (Optional) Add custom header: `X-Cron-Secret: your_cron_secret_key`

#### Option B: Using cron-job.org
1. Go to https://cron-job.org/
2. URL: `https://yourdomain.com/api/blog/cron`
3. Schedule: Every 12 hours (0:00 and 12:00 UTC)
4. HTTP Method: GET

#### Option C: Using Vercel Crons (If Deployed on Vercel)
Create a cron API route in `api/cron/blog.ts`:

```typescript
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/cron`,
      { method: 'GET' }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Cron job failed' });
  }
}
```

#### Option D: Using Node-cron (Local Development)
Create a cron service file for local testing:

```typescript
// services/blogCron.ts
import cron from 'node-cron';

export function startBlogCron() {
  // Run every 12 hours at 00:00 and 12:00
  cron.schedule('0 0,12 * * *', async () => {
    console.log('Running blog auto-post...');
    const response = await fetch(
      `https://www.d-arrow.com//api/blog/cron`,
      { method: 'GET' }
    );
    const data = await response.json();
    console.log('Blog cron result:', data);
  });

  console.log('Blog cron job started');
}
```

## Blog Data Storage

Blog posts are stored in:
```
public/data/blog-posts.json
```

Schedule data is stored in:
```
public/data/blog-schedule.json
```

## Blog Topics Covered

The system generates posts on:
- Digital Marketing trends
- AI in marketing
- Social media marketing
- SEO strategies
- Content marketing
- Email automation
- Influencer marketing
- Video marketing
- Real estate marketing
- E-commerce optimization
- And more...

## Monitoring & Debugging

### Check Blog Status
```bash
curl https://www.d-arrow.com//api/blog/init
```

### Check Schedule Status
```bash
curl https://www.d-arrow.com//api/blog/schedule
```

### View All Posts
```bash
curl https://www.d-arrow.com//api/blog/posts
```

## Frontend Integration

The blog page automatically:
1. Fetches all posts from `/api/blog/posts`
2. Displays posts sorted by date/time (newest first)
3. Allows filtering by category
4. Shows read time estimates
5. Auto-refreshes every 5 minutes

Access the blog at: `/blog`

## Troubleshooting

### Posts not generating?
1. Check ZAI_API_KEY is set correctly
2. Verify API key has permissions
3. Check `public/data/blog-posts.json` exists
4. Review browser console for errors

### Cron job not running?
1. Verify cron service is active
2. Check cron job status on your cron service dashboard
3. Check server logs for errors
4. Ensure CRON_SECRET matches if required

### Posts not appearing on blog page?
1. Check `/api/blog/posts` returns data
2. Clear browser cache
3. Check if posts are in correct JSON format
4. Verify date/time values are correct

## API Response Examples

### Generate Post Response
```json
{
  "success": true,
  "message": "Blog post generated successfully",
  "post": {
    "id": "post-1710764400000",
    "title": "AI Transforms Digital Marketing",
    "content": "...",
    "excerpt": "...",
    "author": "D-Arrow AI",
    "category": "AI & Technology",
    "date": "2024-03-18",
    "time": "14:30:00",
    "readTime": 3,
    "imageUrl": null
  }
}
```

### Schedule Status Response
```json
{
  "success": true,
  "schedule": {
    "today": "2024-03-18",
    "postsGeneratedToday": 2,
    "dailyLimit": 2,
    "nextPostTime": "Tomorrow"
  },
  "totalPosts": 45,
  "recentPosts": [...]
}
```

## Support

For issues or questions:
1. Check ZAI API documentation
2. Review browser console for errors
3. Check server logs
4. Verify all environment variables are set

---

**Last Updated**: March 18, 2024
**Blog System Version**: 1.0
