require('dotenv').config()
import Discord from 'discord.js'

export const client: Discord.Client = new Discord.Client({
	intents: Discord.Intents.ALL &~ Discord.Intents.FLAGS.GUILD_PRESENCES
})

import './database'
import './commands'

client.on('ready', () => {
	console.log('ready')
})

client.login(process.env.token)

