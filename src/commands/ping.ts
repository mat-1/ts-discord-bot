import { literal } from 'node-brigadier'
import { dispatcher } from '../index'
import Discord from 'discord.js'

dispatcher.register(
	literal<Discord.Message>('ping').executes(async (context) => {
		const message = context.getSource()
		await message.channel.send('Pong!')
		return 0
	})
)
