import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role = 'USER' } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const validRole: UserRole =
      role === 'AGENT' ? 'AGENT' : role === 'OWNER' ? 'OWNER' : 'USER';

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        passwordHash,
        role: validRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    // If registered as an AGENT, create corresponding Agent profile
    if (validRole === 'AGENT') {
      await prisma.agent.create({
        data: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 98712 34567',
          specialization: 'Residential & Commercial Advisory',
          city: 'Noida',
          state: 'Uttar Pradesh',
          isVerified: false,
        },
      });
    }

    // Welcome Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to RAS Properties!',
        message: 'Your account has been registered successfully. You can now post properties, save favorites, and track enquiries.',
        type: 'SYSTEM',
        link: '/dashboard',
      },
    });

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      avatar: user.avatar,
    };

    await setAuthCookie(userSession);

    return NextResponse.json(
      { message: 'Registration successful!', user: userSession },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
