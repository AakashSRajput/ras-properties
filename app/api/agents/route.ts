import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const search = searchParams.get('search');

    const where: any = {};
    if (city) where.city = { contains: city };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { specialization: { contains: search } },
        { bio: { contains: search } },
      ];
    }

    const agents = await prisma.agent.findMany({
      where,
      orderBy: { rating: 'desc' },
      include: {
        properties: {
          where: { status: 'APPROVED' },
          take: 3,
          include: { images: { take: 1 } },
        },
      },
    });

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}
