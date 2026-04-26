import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all blog posts
export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
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

    const post = await prisma.blogPost.create({
      data: {
        title: newPost.title || '',
        titleAr: newPost.titleAr || '',
        content: newPost.content || '',
        contentAr: newPost.contentAr || '',
        excerpt: newPost.excerpt || (newPost.content ? newPost.content.substring(0, 150) : ''),
        excerptAr: newPost.excerptAr || (newPost.contentAr ? newPost.contentAr.substring(0, 150) : ''),
        author: newPost.author || 'D-Arrow',
        category: newPost.category || 'Digital Marketing',
        categoryAr: newPost.categoryAr || '',
        date: newPost.date || new Date().toISOString().split('T')[0],
        time: newPost.time || new Date().toTimeString().split(' ')[0],
        readTime: newPost.readTime || Math.ceil(((newPost.content || newPost.contentAr || '').split(' ').length) / 200),
        imageUrl: newPost.imageUrl || null,
        status: newPost.status || 'published',
      }
    });

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

    // Remove id from updates object as it shouldn't be updated
    const { id, createdAt, updatedAt, ...updateData } = updates;

    const post = await prisma.blogPost.update({
      where: { id: updates.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المقال بنجاح',
      post,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
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

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
