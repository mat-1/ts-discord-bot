import { literal } from 'node-brigadier'
import { dispatcher } from '../features/commands'
import Discord from 'discord.js'
import { commandHelp } from './help'

commandHelp['ping'] = 'Ping the bot. This is mainly used to see whether the bot is online'

dispatcher.register(
	literal<Discord.Message>('ping').executes(async (context) => {
		const message = context.getSource()
		await message.reply('Pong!')
		return 0
	})
)
