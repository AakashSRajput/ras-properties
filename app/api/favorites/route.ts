import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: {
            images: { orderBy: { order: 'asc' } },
            agent: true,
          },
        },
      },
    });

    const properties = favorites.map((f) => ({
      ...f.property,
      isFavorited: true,
    }));

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Favorites list error:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}
