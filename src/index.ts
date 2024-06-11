import { hydrateReply } from '@grammyjs/parse-mode'
import { limit } from '@grammyjs/ratelimiter'
import { apiThrottler } from '@grammyjs/transformer-throttler'
import { InlineKeyboard, InlineQueryResultBuilder, session } from 'grammy'

import { getBotToken, isWebhook } from '@/constants/getEnvConfig.js'
import baseBot from '@/core/bot/index.js'

import { globalConfig, groupConfig, outConfig } from './constants/limits.js'
import { development } from './core/bot/launch.js'

const bot = baseBot.errorBoundary(async ({ error, ctx }) => {
    try {
        if (error instanceof Error) {
            const message = error.message
            if (message.includes('Too Many Requests')) {
                console.warn('grammY Too Many Requests error. Skip.', error)
                return
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        console.error('[errorBoundary]', ctx.update, error, (error as any)?.on?.payload)
        let text = `🔥 This isn't supposed to happen
Error: `

        const errorText = error instanceof Error ? error.message : String(error)

        const token = getBotToken()
        text += `<pre>${errorText.replaceAll(token, '')}</pre>`

        const target = (ctx.chat ?? ctx.from!).id

        const keyboard = new InlineKeyboard().text('Dismiss', 'dismiss_message')
        await ctx.api.sendMessage(target, text, {
            link_preview_options: { is_disabled: true },
            parse_mode: 'HTML',
            reply_markup: keyboard,
        })
    } catch (e) {
        //
    }
})

bot.use(session({}))

// Register rate limiter
bot.use(
    limit({
        // Allow only 3 messages to be handled every 2 seconds.
        timeFrame: 2000,
        limit: 3,

        // This is called when the limit is exceeded.
        onLimitExceeded: (ctx) => {
            const keyboard = new InlineKeyboard().text('Dismiss', 'dismiss_message')
            //@TODO send message
        },

        // Note that the key should be a number in string format such as "123456789".
        keyGenerator: (ctx) => {
            return ctx.from?.id.toString()
        },
    }),
)

bot.use(hydrateReply)

const throttler = apiThrottler({
    global: globalConfig,
    group: groupConfig,
    out: outConfig,
})
baseBot.api.config.use(throttler)

//START HERE
// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))

// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Got another message!'))

// Now that you specified how to handle messages, you can start your bot.

// Inline queries
bot.on('inline_query', async (ctx) => {
    const query = ctx.inlineQuery.query
    if (query === '') return ctx.answerInlineQuery([])
    const call = await fetch(`https://api.coincap.io/v2/assets?search=${query}`)
    const result = (await call.json()) as {
        data: { id: string; name: string; priceUsd: string; changePercent24Hr: string }[]
    }

    const answer = result.data.map((item) => {
        return InlineQueryResultBuilder.article(item.id, item.name).text(
            `hello ${ctx.from.first_name}, Token: ${item.name} Price: ${item.priceUsd} Change%: ${item.changePercent24Hr}`,
            { parse_mode: 'HTML' },
        )
    })
    // console.log(answer)
    return ctx.answerInlineQuery(answer, { cache_time: 0 })
})

if (!isWebhook()) {
    void development(baseBot)
}
