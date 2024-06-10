import { log } from "console";
import "dotenv/config"
import { Bot, InlineQueryResultBuilder } from "grammy";
import { userInfo } from "os";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_API_TOKEN || ""); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.

// Inline queries
bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query;
    if (query === '') return ctx.answerInlineQuery([]);
    const call = await fetch(`https://api.coincap.io/v2/assets?search=${query}`);
    const result = await call.json();
    const answer = result.data.map((item: {id: string; name: string; priceUsd: string; changePercent24Hr: string})=> {
        return InlineQueryResultBuilder.article(item.id, item.name).text(`hello ${ctx.from.first_name}, Token: ${item.name} Price: ${item.priceUsd} Change%: ${item.changePercent24Hr}`, {parse_mode: 'HTML'})
    });
    // console.log(answer)
    return ctx.answerInlineQuery(answer);
  });

// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();