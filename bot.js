const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", async ready => {
    console.log("Ready!")
});

bot.on('guildMemberAdd', async member => {
    const loggingChannel = "697557759868272841";
    const secondsToCompleteCaptcha = "120"

    loggingChannel.send(`${member.tag} has joined the server! They must complete their captcha within ${secondsToCompleteCaptcha} seconds.`)

    const captcha = await createCaptcha();
    try {
        const msg = await member.send(`You have ${secondsToCompleteCaptcha} seconds to solve this captcha:`, {
            files: [{
                attachment: `${__dirname}/captchas/${captcha}.png`,
                name: `${captcha}.png`
            }]
        });
        try {
            const filter = m => {
                if(m.author.bot) return;
                if(m.author.id === member.id && m.content === captcha) return true;
                else {
                    m.channel.send(":x: You entered the captcha incorrectly!");
                    loggingChannel.send(`:x: ${member.tag} entered their captcha incorrectly!`)
                    return false;
                }
            };
            const response = await msg.channel.awaitMessages(filter, { max: 1, time: `${secondsToCompleteCaptcha}`*1000, errors: ['time']});
            if(response) {
                await msg.channel.send(':white_check_mark: You have verified that you are not a bot!');
                loggingChannel.send(`:white_check_mark: ${member.tag} entered their captcha correctly and have verified that they are not a bot!`)
                await member.roles.add('640340203763925002');
                await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                    .catch(err => console.log(err));
            }
        }
        catch(err) {
            console.log(err);
            await msg.channel.send(':x: You did not solve the captcha correctly on time!');
            loggingChannel.send(`${member.tag} did not solve their captcha correctly on time!`)
            await member.kick();
            await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                    .catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});

bot.login(process.env.BOT_TOKEN);
