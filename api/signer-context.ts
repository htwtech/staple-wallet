import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrivyClient, createPrivyAppJWKS, verifyAccessToken } from '@privy-io/node'

const PRIVY_APP_ID = process.env.PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!
const API_BASE = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.API_BASE_URL || 'http://localhost:5173'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' })
  }

  if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
    return res.status(500).json({ error: 'Server misconfiguration: Privy credentials' })
  }

  let userId: string
  try {
    const jwks = createPrivyAppJWKS({
      appId: PRIVY_APP_ID,
      apiUrl: 'https://api.privy.io',
      headers: {
        Authorization: `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
      },
    })
    const payload = await verifyAccessToken({
      access_token: token,
      app_id: PRIVY_APP_ID,
      verification_key: jwks,
    })
    userId = payload.user_id
  } catch (e) {
    console.error('Token verification failed', e)
    return res.status(401).json({ error: 'Invalid token' })
  }

  const privy = new PrivyClient({
    appId: PRIVY_APP_ID,
    appSecret: PRIVY_APP_SECRET,
  })

  try {
    const list = privy.wallets().list({ user_id: userId, chain_type: 'starknet' })
    let wallet = null
    for await (const w of list) {
      wallet = w
      break
    }
    if (!wallet) {
      wallet = await privy.wallets().create({
        chain_type: 'starknet',
        owner: { user_id: userId },
      })
    }
    const serverUrl = `${API_BASE}/api/sign`
    return res.status(200).json({
      walletId: wallet.id,
      publicKey: wallet.public_key ?? '',
      serverUrl,
    })
  } catch (e) {
    console.error('Privy wallet create/list failed', e)
    return res.status(500).json({ error: 'Failed to get or create wallet' })
  }
}
