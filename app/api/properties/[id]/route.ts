import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getSession();

    // Check if ID is cuid or slug
    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        agent: true,
        owner: { select: { id: true, name: true, email: true, phone: true } },
        amenities: { include: { amenity: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        favorites: session?.id
          ? {
              where: { userId: session.id },
              select: { id: true },
            }
          : false,
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Increment view count asynchronously
    await prisma.property.update({
      where: { id: property.id },
      data: { views: { increment: 1 } },
    });

    const isFavorited = Array.isArray(property.favorites) && property.favorites.length > 0;

    return NextResponse.json({
      property: {
        ...property,
        isFavorited,
        favorites: undefined,
      },
    });
  } catch (error) {
    console.error('Property detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Only owner or admin can delete
    if (property.ownerId !== session.id && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this listing' }, { status: 403 });
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
