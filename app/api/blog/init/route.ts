import { NextRequest, NextResponse } from 'next/server';

// Initialize blog - Generate 2 initial posts
export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    const expectedKey = process.env.BLOG_API_SECRET_KEY || 'secret';
    
    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    console.log('🚀 Initializing blog system...');

    // Generate 2 initial posts
    const results = [];

    for (let i = 0; i < 2; i++) {
      console.log(`📝 Generating post ${i + 1}/2...`);

      const generateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://www.d-arrow.com/'}/api/blog/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const generateData = await generateResponse.json();
      results.push(generateData);

      if (generateData.success) {
        console.log(`✅ Post ${i + 1} generated: ${generateData.post.title}`);
      } else {
        console.error(`❌ Failed to generate post ${i + 1}`);
      }

      // Add delay between posts to avoid rate limiting
      if (i < 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog system initialized with 2 posts',
      results: results,
    });
  } catch (error) {
    console.error('Error initializing blog:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize blog',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// GET endpoint to check blog initialization status
export async function GET(req: NextRequest) {
  try {
    const postsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://www.d-arrow.com/'}/api/blog/posts`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const postsData = await postsResponse.json();

    return NextResponse.json({
      success: true,
      status: 'Blog system is active',
      postCount: postsData.count || 0,
      posts: postsData.posts || [],
      nextSteps: postsData.count === 0 
        ? 'Initialize blog by POSTing with Bearer token'
        : 'Blog is ready! Posts will auto-generate daily',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check blog status',
    }, { status: 500 });
  }
}
