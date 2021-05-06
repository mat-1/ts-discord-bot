import Brigadier from 'node-brigadier'
import Discord from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client: Discord.Client = new Discord.Client()

export const dispatcher: Brigadier.CommandDispatcher<Discord.Message> = new Brigadier.CommandDispatcher()


// import all the commands here, this must be updated every time you add a new command
import './commands/ping'

const PREFIX = '!'

client.on('message', async(message: Discord.Message) => {
	// the author can't be a bot
	if (message.author.bot) return
	// the message has to start with the prefix
	else if (!message.content.startsWith(PREFIX)) return

	const content = message.content.slice(PREFIX.length).trim()
	const parsedCommand = dispatcher.parse(content, message)
	try {
		await dispatcher.execute(parsedCommand)
	} catch (ex) {
		console.error(ex.getMessage())
	}
})

client.on('ready', () => {
	console.log('ready')
})

client.login(process.env.token)

