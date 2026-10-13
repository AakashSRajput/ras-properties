import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalProperties,
      pendingProperties,
      verifiedProperties,
      featuredProperties,
      totalEnquiries,
      totalVisits,
      totalAgents,
      viewsAggregate,
      propertiesByType,
      propertiesByListingType,
      recentEnquiries,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.property.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.property.count({ where: { verificationStatus: { in: ['VERIFIED', 'RERA_APPROVED'] } } }),
      prisma.property.count({ where: { featured: true } }),
      prisma.enquiry.count(),
      prisma.visitRequest.count(),
      prisma.agent.count(),
      prisma.property.aggregate({ _sum: { views: true } }),
      prisma.property.groupBy({
        by: ['propertyType'],
        _count: { id: true },
      }),
      prisma.property.groupBy({
        by: ['listingType'],
        _count: { id: true },
      }),
      prisma.enquiry.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { property: { select: { title: true, slug: true } } },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalProperties,
        pendingProperties,
        verifiedProperties,
        featuredProperties,
        totalEnquiries,
        totalVisits,
        totalAgents,
        totalViews: viewsAggregate._sum.views || 0,
      },
      charts: {
        propertyTypes: propertiesByType.map((pt) => ({
          name: pt.propertyType,
          count: pt._count.id,
        })),
        listingTypes: propertiesByListingType.map((lt) => ({
          name: lt.listingType.replace('_', ' '),
          count: lt._count.id,
        })),
      },
      recentEnquiries,
    });
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    return NextResponse.json(
      { error: error.message || 'Unauthorized or failed to fetch admin metrics' },
      { status: error.message?.includes('Forbidden') ? 403 : error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
