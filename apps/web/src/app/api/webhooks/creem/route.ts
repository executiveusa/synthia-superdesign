/**
 * POST /api/webhooks/creem
 *
 * Creem.io webhook handler
 * Processes payment.succeeded events
 * Routes 2% pledge to LATAM ecological + AI literacy fund
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  processPaymentSucceeded,
  type CreemWebhookPayload,
} from '@/lib/creem/webhook-handler';

export async function POST(request: NextRequest) {
  try {
    // Get signature from headers
    const signature = request.headers.get('x-creem-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const body = await request.text();

    // Verify signature
    const secret = process.env.CREEM_WEBHOOK_SECRET || '';
    if (!verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse payload
    const payload: CreemWebhookPayload = JSON.parse(body);

    // Only process payment.succeeded events
    if (payload.event !== 'payment.succeeded') {
      return NextResponse.json({ received: true });
    }

    // Process payment
    const result = await processPaymentSucceeded(payload);

    if (!result.success) {
      console.error('[Webhook] Payment processing failed:', result.error);
      return NextResponse.json(
        { error: result.error, received: true },
        { status: 200 }  // Return 200 to acknowledge receipt
      );
    }

    return NextResponse.json({
      success: true,
      user_activated: result.user_activated,
      pledge_amount: result.pledge_amount,
    });
  } catch (error) {
    console.error('[Webhook] Error processing Creem event:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed', received: true },
      { status: 200 }  // Always return 200 to prevent retry loop
    );
  }
}
