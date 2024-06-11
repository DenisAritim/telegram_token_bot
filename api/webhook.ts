import type { VercelRequest, VercelResponse } from '@vercel/node'

import bot from '@/core/bot/index.js'
import { production } from '@/core/bot/launch.js'

// Handler to set webhook url based on request headers
const handler = async (req: VercelRequest, res: VercelResponse) => {
    await production(bot, 'https://' + req.headers.host + '/api/bot')
    return res.status(200).json({ message: 'Webhook set successfully' })
}

export default handler
