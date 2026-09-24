import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Get all blog posts
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status');
    const where = status === 'draft' || status === 'published' ? { status } : undefined;
    const rawPosts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse tags JSON string to array
    const posts = rawPosts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));

    return NextResponse.json({
      success: true,
      source: 'database',
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog posts',
      posts: [],
      count: 0,
    }, { status: 500 });
  }
}

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const VALID_STATUSES = ['published', 'draft'] as const;

const validStatus = (status: unknown): boolean =>
  typeof status === 'string' && (VALID_STATUSES as readonly string[]).includes(status);

// Add a new blog post
export async function POST(req: NextRequest) {
  try {
    const newPost = await req.json();

    const hasTitle = typeof newPost.title === 'string' && newPost.title.trim()
      || typeof newPost.titleAr === 'string' && newPost.titleAr.trim();
    const hasContent = typeof newPost.content === 'string' && newPost.content.trim()
      || typeof newPost.contentAr === 'string' && newPost.contentAr.trim();

    if (!hasTitle || !hasContent) {
      return NextResponse.json({
        success: false,
        error: !hasTitle
          ? 'العنوان مطلوب (بالعربية أو بالإنجليزية)'
          : 'المحتوى مطلوب (بالعربية أو بالإنجليزية)',
      }, { status: 400 });
    }

    if (newPost.status !== undefined && !validStatus(newPost.status)) {
      return NextResponse.json({
        success: false,
        error: 'الحالة غير صالحة — يجب أن تكون "published" أو "draft"',
      }, { status: 400 });
    }

    const slug = newPost.slug ? normalizeSlug(String(newPost.slug)) : null;
    if (slug) {
      const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
      if (existingSlug) {
        return NextResponse.json({
          success: false,
          error: 'الرابط (Slug) مستخدم بالفعل — اختر رابطاً آخر',
        }, { status: 409 });
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        title: newPost.title || '',
        titleAr: newPost.titleAr || '',
        slug,
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
        tags: newPost.tags ? JSON.stringify(newPost.tags) : null,
        status: newPost.status || 'published',
        isGated: newPost.isGated || false,
        ctaType: newPost.ctaType || 'default',
        gatedContent: newPost.gatedContent || null,
        gatedContentAr: newPost.gatedContentAr || null,
      }
    });

    revalidateTag('blog-posts', { expire: 0 });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المقال بنجاح',
      post,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    const message = error instanceof Error ? error.message : String(error);
    const duplicateSlug = /Unique constraint failed/.test(message) || /P2002/.test(message);
    return NextResponse.json({
      success: false,
      error: duplicateSlug
        ? 'الرابط (Slug) مستخدم بالفعل — اختر رابطاً آخر'
        : 'Failed to create blog post: ' + message,
      details: message,
    }, { status: duplicateSlug ? 409 : 500 });
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

    const hasTitleUpdate =
      'title' in updateData || 'titleAr' in updateData;
    const hasContentUpdate =
      'content' in updateData || 'contentAr' in updateData;

    if (hasTitleUpdate &&
      !(typeof updateData.title === 'string' && updateData.title.trim()) &&
      !(typeof updateData.titleAr === 'string' && updateData.titleAr.trim())) {
      return NextResponse.json({
        success: false,
        error: 'العنوان مطلوب (بالعربية أو بالإنجليزية)',
      }, { status: 400 });
    }

    if (hasContentUpdate &&
      !(typeof updateData.content === 'string' && updateData.content.trim()) &&
      !(typeof updateData.contentAr === 'string' && updateData.contentAr.trim())) {
      return NextResponse.json({
        success: false,
        error: 'المحتوى مطلوب (بالعربية أو بالإنجليزية)',
      }, { status: 400 });
    }

    if (updateData.status !== undefined && !validStatus(updateData.status)) {
      return NextResponse.json({
        success: false,
        error: 'الحالة غير صالحة — يجب أن تكون "published" أو "draft"',
      }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'المقال غير موجود',
      }, { status: 404 });
    }

    // Serialize tags array to JSON string if present
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = JSON.stringify(updateData.tags);
    }

    // Normalize slug if present
    if ('slug' in updateData) {
      const normalized = updateData.slug
        ? normalizeSlug(String(updateData.slug))
        : null;
      if (normalized && normalized !== existing.slug) {
        const duplicate = await prisma.blogPost.findUnique({ where: { slug: normalized } });
        if (duplicate) {
          return NextResponse.json({
            success: false,
            error: 'الرابط (Slug) مستخدم بالفعل — اختر رابطاً آخر',
          }, { status: 409 });
        }
      }
      updateData.slug = normalized;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidateTag('blog-posts', { expire: 0 });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المقال بنجاح',
      post,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: 'Failed to update post: ' + message }, { status: 500 });
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

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'المقال غير موجود' }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    revalidateTag('blog-posts', { expire: 0 });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}