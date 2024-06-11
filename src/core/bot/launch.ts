import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Bot } from 'grammy'

import { logger } from '@/lib/logger.js'
import type { BotContext } from '@/session/index.js'

const production = async (bot: Bot<ParseModeFlavor<BotContext>>, webhookUrl: string): Promise<void> => {
    try {
        await bot.api.setWebhook(webhookUrl, {
            drop_pending_updates: true,
        })
        logger.info('[SERVER] Bot starting webhook', {
            metadata: '',
            sendLog: true,
        })
    } catch (e) {
        console.error(e)
    }
}

const development = async (bot: Bot<ParseModeFlavor<BotContext>>): Promise<void> => {
    try {
        await bot.api.deleteWebhook()
        logger.info('[SERVER] Bot starting polling', {
            metadata: '',
            sendLog: false,
        })
        await bot.start()
    } catch (e) {
        console.error(e)
    }
}

export { development, production }
