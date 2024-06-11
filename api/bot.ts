import '@/index.js'

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { webhookCallback } from 'grammy'

import bot from '@/core/bot/index.js'

const handler = (req: VercelRequest, res: VercelResponse) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return webhookCallback(bot, 'https', 'return', 15_000)(req, res)
}

export default handler
