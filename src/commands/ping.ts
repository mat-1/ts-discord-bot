import { literal } from 'node-brigadier'
import { dispatcher } from '../commands'
import Discord from 'discord.js'

dispatcher.register(
	literal<Discord.Message>('ping').executes(async (context) => {
		const message = context.getSource()
		await message.reply('Pong!', { allowedMentions: { users: [] } })
		return 0
	})
)
