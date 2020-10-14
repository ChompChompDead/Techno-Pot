module.exports = {
	name: 'verify',
	description: 'verifies you',
	async run(client, message, args) {
        if (message.member.roles.cache.has('721279634230214677')) {
            message.channel.send('You are already verified.')
        } else {
            client.emit('guildMemberAdd', message.member)
            message.channel.send('Check your DMs!')
        }
	},
};