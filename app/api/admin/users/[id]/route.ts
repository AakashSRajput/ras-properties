import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const body = await req.json();
    const { role, isSuspended } = body;

    // Prevent self-suspension or self-demotion
    if (admin.id === id && (role !== 'ADMIN' || isSuspended === true)) {
      return NextResponse.json({ error: 'You cannot demote or suspend your own admin account.' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (role !== undefined) dataToUpdate.role = role;
    if (isSuspended !== undefined) dataToUpdate.isSuspended = isSuspended;

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;

    if (admin.id === id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
