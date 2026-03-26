import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getBlogDataPath = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'blog-posts.json');
};

// Schedule endpoint to generate 2 posts per day
export async function POST(req: NextRequest) {
  try {
    console.log('📅 Blog Auto-Posting Schedule Triggered');

    // Check schedule file
    const schedulePath = path.join(process.cwd(), 'public', 'data', 'blog-schedule.json');
    let scheduleData: { lastPostTimes: string[] } = { lastPostTimes: [] };

    if (fs.existsSync(schedulePath)) {
      try {
        scheduleData = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
      } catch (e) {
        console.warn('Failed to parse schedule');
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const todayPostCount = (scheduleData.lastPostTimes || []).filter(
      (time: string) => time.startsWith(today)
    ).length;

    console.log(`📊 Posts generated today: ${todayPostCount}/2`);

    // Generate posts if we haven't reached the limit
    if (todayPostCount < 2) {
      console.log('✨ Generating new blog post...');

      const generateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://www.d-arrow.com/'}/api/blog/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BLOG_API_SECRET_KEY || 'secret'}`,
          },
        }
      );

      const generateData = await generateResponse.json();

      if (generateData.success) {
        // Update schedule
        if (!scheduleData.lastPostTimes) {
          scheduleData.lastPostTimes = [];
        }
        scheduleData.lastPostTimes.push(new Date().toISOString());

        // Keep only last 30 days of records
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        scheduleData.lastPostTimes = scheduleData.lastPostTimes.filter(
          (time: string) => new Date(time) > thirtyDaysAgo
        );

        const dataDir = path.join(process.cwd(), 'public', 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(schedulePath, JSON.stringify(scheduleData, null, 2));

        console.log('✅ Blog post generated and scheduled');
        return NextResponse.json({
          success: true,
          message: 'Blog post generated successfully',
          post: generateData.post,
          todayPostCount: todayPostCount + 1,
        });
      } else {
        console.error('Failed to generate post:', generateData.error);
        return NextResponse.json({
          success: false,
          error: generateData.error,
          message: 'Failed to generate blog post',
        }, { status: 500 });
      }
    } else {
      console.log('ℹ️ Daily post limit already reached (2 posts)');
      return NextResponse.json({
        success: true,
        message: 'Daily post limit already reached',
        todayPostCount: todayPostCount,
        posts: await getPosts(),
      });
    }
  } catch (error) {
    console.error('❌ Error in blog schedule:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process blog schedule',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// Get current posts count
async function getPosts() {
  try {
    const filePath = getBlogDataPath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.posts || [];
    }
  } catch (e) {
    console.warn('Failed to get posts');
  }
  return [];
}

// GET endpoint to check schedule status
export async function GET(req: NextRequest) {
  try {
    const schedulePath = path.join(process.cwd(), 'public', 'data', 'blog-schedule.json');
    let scheduleData: { lastPostTimes: string[] } = { lastPostTimes: [] };

    if (fs.existsSync(schedulePath)) {
      scheduleData = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
    }

    const today = new Date().toISOString().split('T')[0];
    const todayPostCount = (scheduleData.lastPostTimes || []).filter(
      (time: string) => time.startsWith(today)
    ).length;

    const posts = await getPosts();

    return NextResponse.json({
      success: true,
      schedule: {
        today: today,
        postsGeneratedToday: todayPostCount,
        dailyLimit: 2,
        nextPostTime: todayPostCount < 2 ? 'Soon' : 'Tomorrow',
      },
      totalPosts: posts.length,
      recentPosts: posts.slice(-5),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch schedule status',
    }, { status: 500 });
  }
}
