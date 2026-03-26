import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Blog posts storage file
const getBlogDataPath = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'blog-posts.json');
};

// Initialize blog data file
const initializeBlogData = () => {
  const filePath = getBlogDataPath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ posts: [], lastGenerated: null }, null, 2));
  }
};

// Get all blog posts
export async function GET(req: NextRequest) {
  try {
    initializeBlogData();
    const filePath = getBlogDataPath();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    return NextResponse.json({
      success: true,
      posts: data.posts || [],
      count: (data.posts || []).length,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog posts',
      posts: [],
    }, { status: 500 });
  }
}

// Add a new blog post
export async function POST(req: NextRequest) {
  try {
    const newPost = await req.json();
    
    // Validate required fields
    if (!newPost.title || !newPost.content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, content',
      }, { status: 400 });
    }

    initializeBlogData();
    const filePath = getBlogDataPath();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Create post with ID
    const post = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.excerpt || newPost.content.substring(0, 150),
      author: newPost.author || 'D-Arrow AI',
      category: newPost.category || 'News',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      readTime: Math.ceil(newPost.content.split(' ').length / 200),
      imageUrl: newPost.imageUrl || null,
    };

    data.posts = data.posts || [];
    data.posts.push(post);
    data.lastGenerated = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create blog post',
    }, { status: 500 });
  }
}
