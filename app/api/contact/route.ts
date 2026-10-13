import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail, emailTemplateWrapper } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Real Estate Inquiry',
        message,
        status: 'UNREAD',
      },
    });

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: `Thank you for contacting RAS Properties - ${subject || 'Inquiry'}`,
      html: emailTemplateWrapper(
        'Message Received',
        `<p>Dear ${name},</p>
         <p>Thank you for reaching out to <strong>RAS Properties</strong>.</p>
         <p>Our senior real estate advisory team has received your message and will get back to you within 24 business hours.</p>
         <div class="highlight">
           <strong>Your Query:</strong><br/>"${message}"
         </div>`
      ),
    });

    return NextResponse.json({ message: 'Message sent successfully! We will contact you soon.', contact }, { status: 201 });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
