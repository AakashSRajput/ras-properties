import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [{ id }, { email: id }],
      },
      include: {
        properties: {
          where: { status: 'APPROVED' },
          include: {
            images: { orderBy: { order: 'asc' } },
            agent: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Agent details error:', error);
    return NextResponse.json({ error: 'Failed to fetch agent profile' }, { status: 500 });
  }
}
