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
    
    const hasTitle = newPost.title || newPost.titleAr;
    const hasContent = newPost.content || newPost.contentAr;

    if (!hasTitle || !hasContent) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title or titleAr, and content or contentAr',
      }, { status: 400 });
    }

    initializeBlogData();
    const filePath = getBlogDataPath();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const post = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      titleAr: newPost.titleAr || '',
      content: newPost.content,
      contentAr: newPost.contentAr || '',
      excerpt: newPost.excerpt || newPost.content.substring(0, 150),
      excerptAr: newPost.excerptAr || '',
      author: newPost.author || 'D-Arrow',
      category: newPost.category || 'News',
      categoryAr: newPost.categoryAr || '',
      date: newPost.date || new Date().toISOString().split('T')[0],
      time: newPost.time || new Date().toTimeString().split(' ')[0],
      readTime: newPost.readTime || Math.ceil(newPost.content.split(' ').length / 200),
      imageUrl: newPost.imageUrl || null,
      status: newPost.status || 'published',
    };

    data.posts = data.posts || [];
    data.posts.push(post);
    data.lastGenerated = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المقال بنجاح',
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

// Update a blog post
export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();
    
    if (!updates.id) {
      return NextResponse.json({ success: false, error: 'Missing post ID' }, { status: 400 });
    }

    initializeBlogData();
    const filePath = getBlogDataPath();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const postIndex = data.posts.findIndex((p: any) => p.id === updates.id);
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
    }

    data.posts[postIndex] = { ...data.posts[postIndex], ...updates, updatedAt: new Date().toISOString() };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المقال بنجاح',
      post: data.posts[postIndex],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
  }
}

// Delete a blog post
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing post ID' }, { status: 400 });
    }

    initializeBlogData();
    const filePath = getBlogDataPath();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const originalLength = data.posts.length;
    data.posts = data.posts.filter((p: any) => p.id !== id);
    
    if (data.posts.length === originalLength) {
      return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
