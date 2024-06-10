"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const grammy_1 = require("grammy");
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot(process.env.BOT_API_TOKEN || ""); // <-- put your bot token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));
// Now that you specified how to handle messages, you can start your bot.
// Inline queries
bot.on("inline_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ctx.inlineQuery.query;
    if (query === '')
        return ctx.answerInlineQuery([]);
    const call = yield fetch(`https://api.coincap.io/v2/assets?search=${query}`);
    const result = yield call.json();
    const answer = result.data.map((item) => {
        return grammy_1.InlineQueryResultBuilder.article(item.id, item.name).text(`hello ${ctx.from.first_name}, Token: ${item.name} Price: ${item.priceUsd} Change%: ${item.changePercent24Hr}`, { parse_mode: 'HTML' });
    });
    // console.log(answer)
    return ctx.answerInlineQuery(answer);
}));
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start();
