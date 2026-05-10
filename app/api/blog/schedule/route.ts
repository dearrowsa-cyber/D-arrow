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
// Schedule endpoint (Disabled by admin request)
export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Auto-posting schedule is permanently disabled by admin request.',
    disabled: true
  });
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
