import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Check existing favorite
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.id,
          propertyId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ isFavorited: false, message: 'Removed from favorites' });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.id,
          propertyId,
        },
      });
      return NextResponse.json({ isFavorited: true, message: 'Saved to favorites' });
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}
