import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import { Bot } from 'grammy'

import { getBotToken } from '@/constants/getEnvConfig.js'
import type { BotContext } from '@/session/index.js'

const BOT_TOKEN = getBotToken()
const bot = new Bot<ParseModeFlavor<BotContext>>(BOT_TOKEN, {
    botInfo: {
        is_bot: true,
        can_join_groups: true,
        supports_inline_queries: true,
        can_read_all_group_messages: false,
        id: parseInt(process.env.TELEGRAM_BOT_ID || '0', 0),
        first_name: 'T_Tokenbot',
        username: 'T_Tokenbot',
    },
})

export default bot
