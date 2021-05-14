require('dotenv').config()
import Discord from 'discord.js'

// if you want to import commands go to /features/commands.ts
import './features/commands'
import './features/database'


// if you want to change the bot's prefix, change this value
export const PREFIX = '!'
export const AGREE_REACTION = '✅'
export const DISAGREE_REACTION = '❌'

export const client: Discord.Client = new Discord.Client({
	intents: Discord.Intents.ALL,
	allowedMentions: {
		repliedUser: false
	},
	partials: [ 'CHANNEL' ]
})

/** User ids mapped to the last time they sent a message */
export let recentUsers: { [ key: string ]: number } = {}


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

