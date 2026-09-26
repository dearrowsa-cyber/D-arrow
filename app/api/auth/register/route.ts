import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createUserToken, USER_AUTH_COOKIE } from '@/lib/user-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, companyName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال جميع الحقول المطلوبة (الاسم، البريد، كلمة المرور)' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام' },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول مباشرة' },
        { status: 400 }
      );
    }

    // Hash password & create user
    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        phone: phone ? phone.trim() : null,
        companyName: companyName ? companyName.trim() : null,
        role: 'client',
      },
    });

    // Create session token
    const token = createUserToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      companyName: user.companyName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
      message: 'تم إنشاء الحساب بنجاح',
    });

    // Set secure cookie
    response.cookies.set(USER_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً' },
      { status: 500 }
    );
  }
}
