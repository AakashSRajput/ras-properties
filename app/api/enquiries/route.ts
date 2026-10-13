import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendEmail, emailTemplateWrapper } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let where: any = {};
    if (session.role === 'ADMIN') {
      where = {}; // Admin sees all enquiries
    } else if (session.role === 'AGENT') {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      where = agent ? { agentId: agent.id } : { userId: session.id };
    } else {
      where = { userId: session.id };
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            locality: true,
            city: true,
            images: { take: 1 },
          },
        },
        agent: true,
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error('Enquiries fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { name, email, phone, message, preferredDate, preferredTime, propertyId } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Name, phone, and message are required' }, { status: 400 });
    }

    let targetProperty: any = null;
    let agentId: string | null = null;

    if (propertyId) {
      targetProperty = await prisma.property.findFirst({
        where: { OR: [{ id: propertyId }, { slug: propertyId }] },
        include: { agent: true },
      });
      if (targetProperty) {
        agentId = targetProperty.agentId;
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email: email || '',
        phone,
        message,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        propertyId: targetProperty?.id || null,
        userId: session?.id || null,
        agentId: agentId,
        status: 'NEW',
      },
    });

    // Notify agent or admin
    if (targetProperty?.ownerId) {
      await prisma.notification.create({
        data: {
          userId: targetProperty.ownerId,
          title: 'New Enquiry Received!',
          message: `${name} has enquired about your property "${targetProperty.title}". Contact: ${phone}`,
          type: 'ENQUIRY',
          link: '/dashboard/enquiries',
        },
      });
    }

    // Send email notification to user & agent
    if (email) {
      await sendEmail({
        to: email,
        subject: `Enquiry Confirmation - ${targetProperty ? targetProperty.title : 'RAS Properties'}`,
        html: emailTemplateWrapper(
          'Enquiry Received Successfully',
          `<p>Dear ${name},</p>
           <p>Thank you for reaching out to <strong>RAS Properties</strong> regarding <strong>${targetProperty ? targetProperty.title : 'our real estate services'}</strong>.</p>
           <p>Our dedicated property manager has received your inquiry and will contact you at <strong>${phone}</strong> shortly.</p>
           <div class="highlight">
             <strong>Your Message:</strong><br/>"${message}"
           </div>`
        ),
      });
    }

    return NextResponse.json(
      { message: 'Enquiry submitted successfully!', enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create enquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
