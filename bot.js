const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", async ready => {
    console.log("Ready!")
});

bot.on("message", async message => {
    if(message.content.startsWith("hi")) {
        message.channel.send(`Hello, ${message.author}! :slight_smile:`)
    }
});

bot.login(process.env.BOT_TOKEN);
