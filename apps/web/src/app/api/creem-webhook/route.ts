import { NextRequest, NextResponse } from 'next/server'

const PLEDGE_PCT = 0.02

export async function POST(req: NextRequest) {
  const sig = req.headers.get('creem-signature')
  if (!sig || sig !== process.env.CREEM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    event: string
    data: {
      amount: number
      customer_email: string
      product_id: string
      customer_id: string
    }
  }
  const { event, data } = body

  if (event === 'payment.succeeded') {
    const amountCents: number = data.amount
    const pledgeCents = Math.floor(amountCents * PLEDGE_PCT)

    const tierMap: Record<string, string> = {
      [process.env.CREEM_STARTER_ID || '']: 'starter',
      [process.env.CREEM_PRO_ID || '']: 'pro',
      [process.env.CREEM_OPERATOR_ID || '']: 'operator',
    }
    const tier = tierMap[data.product_id] || 'starter'

    console.log(
      `[SYNTHIA PLEDGE] $${(amountCents / 100).toFixed(2)} sale → $${(pledgeCents / 100).toFixed(2)} to LATAM eco+literacy fund | tier: ${tier}`
    )

    // Provision access via Supabase admin (requires service role key in production)
    // This is a placeholder — wire to Supabase admin API when SUPABASE_SERVICE_ROLE_KEY is set
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { createServerSupabaseClient } = await import('@/lib/supabase/server')
        const supabase = await createServerSupabaseClient()
        const { data: users } = await supabase.auth.admin.listUsers()
        const user = users?.users?.find(u => u.email === data.customer_email)
        if (user) {
          await supabase.from('profiles').upsert({ id: user.id, tier, creem_customer_id: data.customer_id })
        }
      } catch (err) {
        console.error('[CREEM WEBHOOK] Supabase provision error:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
