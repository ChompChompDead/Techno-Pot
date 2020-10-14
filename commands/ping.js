const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'ping',
	description: 'Ping!',
	async run(client, message, args) {
		const msg = await message.channel.send('Pinging...')
		const embed = new MessageEmbed()
		.setTitle('Pong!')
		.setDescription(`Websocket Ping: ${client.ws.ping}ms\nMessage Ping: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
		.setColor(`BLUE`)
		msg.edit(embed)
	},
};