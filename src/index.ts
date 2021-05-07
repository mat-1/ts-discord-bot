require('dotenv').config()
import Discord from 'discord.js'
import * as commands from './commands'

// if you want to change the bot's prefix, change this value
const PREFIX = '!'


import './database'


export const client: Discord.Client = new Discord.Client()

/** User ids mapped to the last time they sent a message */
export let recentUsers: { [ key: string ]: number } = {}


client.on('message', async(message: Discord.Message) => {
	recentUsers[message.author.id] = Date.now()

	// the author can't be a bot
	if (message.author.bot) return
	// the message has to start with the prefix
	else if (!message.content.startsWith(PREFIX)) return

	const content = message.content.slice(PREFIX.length).trim()
	const parsedCommand = commands.dispatcher.parse(content, message)
	try {
		await commands.dispatcher.execute(parsedCommand)
	} catch (ex) {
		if (ex.getMessage) {
			const errorMessage: string = ex.getMessage()

			// don't care about these errors
			if (errorMessage.startsWith('Unknown command at position 0: '))
				return

			console.error(errorMessage)
			await message.channel.send(errorMessage)
		} else {
			console.error(ex)
		}
	}
})

/** Remove users that haven't talked for an hour from `recentUsers` */
function flushRecentUsers() {
	const cutoff = Date.now() - (60 * 60 * 1000)
	for (const [ userId, lastMessageDate ] of Object.entries(recentUsers)) {
		if (lastMessageDate < cutoff) {
			delete recentUsers[userId]
		}
	}
}

// flush recent users every minute
setInterval(flushRecentUsers, 60 * 1000)

client.on('ready', () => {
	console.log('ready')
})

client.login(process.env.token)

