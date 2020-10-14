const fs = require('fs')
const discord = require('discord.js')
const client = new discord.Client({ disableMentions: "everyone" })
const { prefix, token } = require('./config.json')

client.commands = new discord.Collection()

const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}


client.on('ready', () => {
    console.log('bot on loser!!!')
});

client.on('guildMemberAdd', async member => {
    let d = await fetch('https://api.no-api-key.com/api/v2/captcha').then(res => res.json())
    try {
        let dm = await member.user.send('Hello there! To get into the server you need to verify. Type the words and numbers in the captcha below.\n' + d.captcha)
        const collector = dm.channel.createMessageCollector((x) => x.author.id == member.id)
        let i = 0
        collector.on('collect', (message) => {
            if (message.content.toLowerCase() != d.captcha_text.toLowerCase()) {
                i++;
                dm.channel.send('That was not the correct captcha.')
                if(i >=3) return collector.stop("Member has failed captcha verification.")
            } else if (message.content.toLowerCase() == d.captcha_text.toLowerCase()) {
                return collector.stop("Member has passed verification.")
            }
        });
        collector.on('end', (collected, reason) => {
            if(reason == "Member has failed captcha verification.") {
                dm.channel.send("You failed the verification. Run t!verify in the server.")
            } else if (reason == "Member has passed verification.") {
                dm.channel.send('You are verified!')
                member.roles.add('720827513529565235')
                member.roles.add('721279634230214677')
                member.roles.remove('736296192622854155')
            }
        })
    } catch {
        await member.guild.channels.cache.find(c => c.name == 'verify').send(`Hey ${member}! You need to turn on your DMs to verify.`)
    }
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const cmd = args.shift().toLowerCase()

    if (!client.commands.has(cmd)) return

    const command = client.commands.get(cmd)

    try {
        command.run(client, message, args);
    } catch (err) {
        console.log(err)
    }
});


client.login(token)