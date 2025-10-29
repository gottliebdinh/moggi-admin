import { NextRequest, NextResponse } from 'next/server'
import { renderOrderMessageEmail, renderReservationMessageEmail } from '@/lib/emailTemplates'
import { Resend } from 'resend'

export const runtime = 'nodejs'

type SendBody = {
  type: 'order' | 'reservation'
  to: string
  subject?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const { type, to, message, subject }: SendBody = await request.json()

    if (!to || !message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const html = type === 'order' ? renderOrderMessageEmail(message) : renderReservationMessageEmail(message)

    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM || 'MOGGI <noreply@gdinh.de>'

    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const mailSubject = subject || (type === 'order' ? 'Nachricht zu deiner Bestellung' : 'Nachricht zu deiner Reservierung')

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: mailSubject,
      html,
    })

    if (error) {
      console.error('Resend error', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Email send error', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}


