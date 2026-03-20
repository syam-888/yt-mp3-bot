const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('ytdl-core');
const fs = require('fs');

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes("youtube.com")) return;

    try {

        await bot.sendMessage(chatId, "⏳ Downloading audio...");

        const file = `audio_${Date.now()}.mp3`;

        const stream = ytdl(text, { filter: 'audioonly' });

        stream.pipe(fs.createWriteStream(file))
        .on('finish', async () => {

            await bot.sendAudio(chatId, file);

            fs.unlinkSync(file);
        });

    } catch (err) {
        console.log(err);
        bot.sendMessage(chatId, "❌ Failed");
    }

});
