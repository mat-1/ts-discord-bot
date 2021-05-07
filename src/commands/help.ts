import { literal } from 'node-brigadier'
import { dispatcher } from '../commands'
import Discord, { MessageEmbed } from 'discord.js'

dispatcher.register(
	literal<Discord.Message>('help').executes(async (context) => {
		const message = context.getSource()
		const allUsage = dispatcher.getAllUsage(dispatcher.getRoot(), message, true)

		const allUsageMessages: string[] = []
		let currentUsageMessage = ''

		for (const usage of allUsage) {
			const newLine = `${usage}\n`
			if (currentUsageMessage && currentUsageMessage.length + newLine.length > 2048) {
				allUsageMessages.push(currentUsageMessage)
				currentUsageMessage = ''
			}
			currentUsageMessage += newLine
		}
		if (currentUsageMessage)
			allUsageMessages.push(currentUsageMessage)

		try {
			for (const usageMessage of allUsageMessages) {
				await message.author.send(new MessageEmbed({
					title: 'Commands',
					description: usageMessage
				}))
			}
			await message.reply('Ok, dmed you all the bot\'s commands.', { allowedMentions: { users: [] } })
		} catch {
			await message.reply('You have dms disabled, please enable them.', { allowedMentions: { users: [] } })
		}
		return 0
	})
)
