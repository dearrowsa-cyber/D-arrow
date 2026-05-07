import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, GIF, SVG' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'حجم الملف كبير جداً. الحد الأقصى 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error('Upload error details:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'فشل في رفع الملف',
      debug: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
