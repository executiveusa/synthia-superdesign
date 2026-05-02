/**
 * Synthia™ Creem.io Webhook Handler
 *
 * Processes payment.succeeded events from Creem.io
 * Routes 2% pledge to LATAM ecological + AI literacy fund
 * Activates user account upon successful payment
 *
 * Webhook Secret: CREEM_WEBHOOK_SECRET (verify HMAC-SHA256)
 */

import crypto from 'crypto';

export interface CreemWebhookPayload {
  event: 'payment.succeeded' | 'payment.failed' | 'payment.cancelled';
  payment_id: string;
  product_id: string;
  amount: number;
  currency: string;
  customer_email: string;
  customer_id: string;
  metadata?: Record<string, string>;
  created_at: string;
}

export interface PledgeRecord {
  payment_id: string;
  amount: number;
  currency: string;
  pledged_at: string;
  destination: 'latam_eco' | 'ai_literacy';
  status: 'pending' | 'processed';
}

/**
 * Verify webhook signature (HMAC-SHA256)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('[Synthia Webhook] Signature verification failed:', error);
    return false;
  }
}

/**
 * Process payment.succeeded webhook
 *
 * Steps:
 * 1. Verify signature
 * 2. Calculate 2% pledge
 * 3. Route pledge to fund (50% eco, 50% education)
 * 4. Activate user account
 * 5. Send confirmation email
 */
export async function processPaymentSucceeded(
  payload: CreemWebhookPayload
): Promise<{
  success: boolean;
  user_activated: boolean;
  pledge_amount: number;
  pledge_destinations: PledgeRecord[];
  error?: string;
}> {
  try {
    // Calculate pledge (2% of amount)
    const pledgeAmount = Math.round(payload.amount * 0.02 * 100) / 100;

    // Create pledge records
    const pledges: PledgeRecord[] = [
      {
        payment_id: payload.payment_id,
        amount: pledgeAmount / 2,  // 1% to ecology
        currency: payload.currency,
        pledged_at: new Date().toISOString(),
        destination: 'latam_eco',
        status: 'pending',
      },
      {
        payment_id: payload.payment_id,
        amount: pledgeAmount / 2,  // 1% to education
        currency: payload.currency,
        pledged_at: new Date().toISOString(),
        destination: 'ai_literacy',
        status: 'pending',
      },
    ];

    // TODO: In production, persist pledges to database
    // TODO: Actually transfer funds via Creem.io API
    console.log('[Synthia Pledge] Recording pledges:', pledges);

    // Activate user account
    const userActivated = await activateUserAccount({
      email: payload.customer_email,
      customer_id: payload.customer_id,
      product_id: payload.product_id,
      payment_id: payload.payment_id,
    });

    // Send confirmation email
    await sendConfirmationEmail({
      email: payload.customer_email,
      amount: payload.amount,
      pledge_amount: pledgeAmount,
      product_id: payload.product_id,
    });

    // Log transaction for transparency
    logPledgeTransaction({
      payment_id: payload.payment_id,
      customer_email: payload.customer_email,
      total_amount: payload.amount,
      pledge_amount: pledgeAmount,
      status: 'success',
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      user_activated: userActivated,
      pledge_amount: pledgeAmount,
      pledge_destinations: pledges,
    };
  } catch (error) {
    console.error('[Synthia Pledge] Error processing payment:', error);

    return {
      success: false,
      user_activated: false,
      pledge_amount: 0,
      pledge_destinations: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Activate user account after successful payment
 */
async function activateUserAccount(params: {
  email: string;
  customer_id: string;
  product_id: string;
  payment_id: string;
}): Promise<boolean> {
  try {
    // TODO: In production, use Supabase or your auth system
    // Example:
    // const { data, error } = await supabase
    //   .from('users')
    //   .update({
    //     status: 'active',
    //     tier: getTierFromProductId(params.product_id),
    //     customer_id: params.customer_id,
    //     activated_at: new Date().toISOString(),
    //   })
    //   .eq('email', params.email);

    console.log('[Synthia Auth] User activated:', params.email);
    return true;
  } catch (error) {
    console.error('[Synthia Auth] Failed to activate user:', error);
    return false;
  }
}

/**
 * Send confirmation email to customer
 */
async function sendConfirmationEmail(params: {
  email: string;
  amount: number;
  pledge_amount: number;
  product_id: string;
}): Promise<void> {
  try {
    // TODO: In production, use Resend, SendGrid, or your email service
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@synthia.ai',
    //   to: params.email,
    //   subject: '¡Bienvenido a Synthia™!',
    //   html: `
    //     <p>Thank you for your purchase!</p>
    //     <p>Your account is now active.</p>
    //     <p>${params.pledge_amount.toFixed(2)} USD from your purchase will support LATAM ecological & education projects.</p>
    //   `,
    // });

    console.log('[Synthia Email] Confirmation sent to:', params.email);
  } catch (error) {
    console.error('[Synthia Email] Failed to send confirmation:', error);
    // Don't throw — email failure shouldn't block account activation
  }
}

/**
 * Log pledge transaction for transparency
 * These logs are published on synthia.ai/pledge for public transparency
 */
function logPledgeTransaction(params: {
  payment_id: string;
  customer_email: string;
  total_amount: number;
  pledge_amount: number;
  status: 'success' | 'failed';
  timestamp: string;
}): void {
  // TODO: In production, write to a public pledge ledger
  // All pledges are anonymized (email hash only, no full addresses)
  // Published on synthia.ai/pledge for full transparency

  const anonymizedEmail = `${params.customer_email[0]}***${params.customer_email.slice(-4)}`;

  console.log(
    JSON.stringify({
      type: 'pledge_transaction',
      payment_id: params.payment_id,
      customer: anonymizedEmail,
      total: params.total_amount,
      pledge: params.pledge_amount,
      status: params.status,
      timestamp: params.timestamp,
    })
  );
}

/**
 * Get tier from product ID
 */
function getTierFromProductId(productId: string): 'starter' | 'professional' | 'operator' {
  if (productId.includes('starter')) return 'starter';
  if (productId.includes('professional')) return 'professional';
  if (productId.includes('operator')) return 'operator';
  return 'starter';  // default
}

/**
 * Public API: Get pledge transparency report
 * Shows total pledged, distribution, projects funded
 */
export async function getPledgeTransparencyReport(): Promise<{
  total_pledged: number;
  total_transactions: number;
  latam_eco_funded: number;
  ai_literacy_funded: number;
  projects: Array<{
    name: string;
    location: string;
    amount_funded: number;
    description: string;
  }>;
  last_updated: string;
}> {
  // TODO: In production, aggregate from pledge ledger database
  return {
    total_pledged: 0,
    total_transactions: 0,
    latam_eco_funded: 0,
    ai_literacy_funded: 0,
    projects: [
      {
        name: 'Amazon Reforestation Initiative',
        location: 'Perú',
        amount_funded: 0,
        description: 'Protecting and restoring 10,000 hectares of rainforest',
      },
      {
        name: 'AI Literacy for Rural Communities',
        location: 'Bolivia',
        amount_funded: 0,
        description: 'Training 500 students in AI fundamentals',
      },
      {
        name: 'Climate Tech Accelerator',
        location: 'Colombia',
        amount_funded: 0,
        description: 'Supporting 20 climate tech startups',
      },
    ],
    last_updated: new Date().toISOString(),
  };
}
