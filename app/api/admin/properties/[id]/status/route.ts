import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const body = await req.json();
    const { status, verificationStatus, featured } = body;

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (verificationStatus !== undefined) dataToUpdate.verificationStatus = verificationStatus;
    if (featured !== undefined) dataToUpdate.featured = featured;

    const property = await prisma.property.update({
      where: { id },
      data: dataToUpdate,
    });

    // Notify owner of property status update
    if (property.ownerId && status) {
      await prisma.notification.create({
        data: {
          userId: property.ownerId,
          title: `Property Status Updated: ${status}`,
          message: `Your property "${property.title}" status has been updated to ${status}.`,
          type: status === 'APPROVED' ? 'PROPERTY_APPROVED' : 'PROPERTY_REJECTED',
          link: `/dashboard/my-properties`,
        },
      });
    }

    return NextResponse.json({ message: 'Property status updated successfully', property });
  } catch (error: any) {
    console.error('Update property status error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update property status' }, { status: 500 });
  }
}
