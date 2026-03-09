import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrivyClient } from '@privy-io/node'

const PRIVY_APP_ID = process.env.PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {}
  const { walletId, hash } = body as { walletId?: string; hash?: string }
  if (!walletId || typeof hash !== 'string') {
    return res.status(400).json({ error: 'Missing walletId or hash' })
  }

  if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  const privy = new PrivyClient({
    appId: PRIVY_APP_ID,
    appSecret: PRIVY_APP_SECRET,
  })

  try {
    const result = await privy.wallets().rawSign(walletId, {
      params: { hash: hash.startsWith('0x') ? hash : `0x${hash}` },
    })
    return res.status(200).json({ signature: result.signature })
  } catch (e) {
    console.error('RawSign failed', e)
    return res.status(500).json({ error: 'Signing failed' })
  }
}
