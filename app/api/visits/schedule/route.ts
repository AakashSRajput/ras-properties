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
      where = {};
    } else if (session.role === 'AGENT') {
      const agent = await prisma.agent.findUnique({ where: { userId: session.id } });
      where = agent ? { agentId: agent.id } : { userId: session.id };
    } else {
      where = { userId: session.id };
    }

    const visits = await prisma.visitRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            address: true,
            locality: true,
            city: true,
            images: { take: 1 },
          },
        },
        agent: true,
      },
    });

    return NextResponse.json({ visits });
  } catch (error) {
    console.error('Visits fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { propertyId, agentId, name, email, phone, visitDate, visitTime, message } = body;

    if (!propertyId || !name || !phone || !visitDate || !visitTime) {
      return NextResponse.json({ error: 'Missing required visit details' }, { status: 400 });
    }

    const property = await prisma.property.findFirst({
      where: { OR: [{ id: propertyId }, { slug: propertyId }] },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const visit = await prisma.visitRequest.create({
      data: {
        propertyId: property.id,
        userId: session?.id || null,
        agentId: agentId || property.agentId || null,
        name,
        email: email || '',
        phone,
        visitDate,
        visitTime,
        message: message || '',
        status: 'PENDING',
      },
    });

    // Create Notification
    if (session?.id) {
      await prisma.notification.create({
        data: {
          userId: session.id,
          title: 'Site Visit Requested',
          message: `Your visit for "${property.title}" on ${visitDate} at ${visitTime} is booked.`,
          type: 'VISIT',
          link: '/dashboard/visits',
        },
      });
    }

    // Confirmation Email
    if (email) {
      await sendEmail({
        to: email,
        subject: `Site Visit Booked: ${property.title}`,
        html: emailTemplateWrapper(
          'Site Visit Confirmation',
          `<p>Dear ${name},</p>
           <p>Your physical site inspection for <strong>${property.title}</strong> has been scheduled.</p>
           <div class="highlight">
             <strong>Date:</strong> ${visitDate}<br/>
             <strong>Time:</strong> ${visitTime}<br/>
             <strong>Location:</strong> ${property.address}, ${property.locality}, ${property.city}
           </div>
           <p>Our authorized property executive will coordinate with you prior to the visit.</p>`
        ),
      });
    }

    return NextResponse.json({ message: 'Visit scheduled successfully!', visit }, { status: 201 });
  } catch (error) {
    console.error('Schedule visit error:', error);
    return NextResponse.json({ error: 'Failed to schedule visit' }, { status: 500 });
  }
}
