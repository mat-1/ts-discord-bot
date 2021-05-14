import { argument, greedyString, literal, string, SuggestionsBuilder } from 'node-brigadier'
import { dispatcher } from '../features/commands'
import Discord, { MessageEmbed } from 'discord.js'

/** An object containing {command: usage} pairs */
export const commandHelp: { [ commandName: string ]: string } = {}

commandHelp['help'] = 'DMs you a list of all the bot\'s commands'
commandHelp['help <command>'] = 'Shows you how to use an individual command'


dispatcher.register(
	literal<Discord.Message>('help')
	.executes(async (context) => {
		const message = context.getSource()
		const allUsage = dispatcher.getAllUsage(dispatcher.getRoot(), message, true)

		const allUsageMessages: string[] = []
		let currentUsageMessage = ''

		for (const usage of allUsage) {
			const newLine = commandHelp[usage]
				? `**${usage}** - ${commandHelp[usage]}\n`
				: `**${usage}**\n`

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
			if (message.channel.type !== 'dm')
				await message.reply('Ok, dmed you all the bot\'s commands.')
		} catch {
			await message.reply('You have dms disabled, please enable them.')
		}
		return 0
	})
	.then(
		argument<Discord.Message, String>('command', greedyString())
		.executes(async (context) => {
			const message = context.getSource()
			const command: string = context.getArgument('command')
			const parsedCommand = dispatcher.parse(command, message)

			const nodes = parsedCommand.getContext().getNodes()
			const combinedName = nodes.map(n => n.getNode().getName()).join(' ')
			const node = nodes[nodes.length - 1].getNode()

			const allUsage: string[] = []
			
			for (const usageMessagePartial of await dispatcher.getAllUsage(node, message, true)) {
				allUsage.push(`${combinedName} ${usageMessagePartial}`.trimEnd())
			}


			let allUsageMessages: string[] = []
			
			let currentUsageMessage = commandHelp[combinedName] ? `*${commandHelp[combinedName]}*\n\n` : ''
	
			for (const usage of allUsage) {
				const newLine = commandHelp[usage]
				? `**${usage}** - ${commandHelp[usage]}\n`
				: `**${usage}**\n`

				if (currentUsageMessage && currentUsageMessage.length + newLine.length > 2048) {
					allUsageMessages.push(currentUsageMessage)
					currentUsageMessage = ''
				}
				currentUsageMessage += newLine
			}
			if (currentUsageMessage)
				allUsageMessages.push(currentUsageMessage)
	
			try {
				let title: string = `**${combinedName}** command`
				if (commandHelp[combinedName] && allUsage.length === 1) {
					allUsageMessages = [ `*${commandHelp[combinedName]}*` ]
					title = `**${allUsage[0]}** command`
				}
				for (const usageMessage of allUsageMessages) {
					await message.author.send(new MessageEmbed({
						title: title,
						description: usageMessage
					}))
				}
				if (message.channel.type !== 'dm')
					await message.reply(`Ok, dmed you usage for ${combinedName}.`)
			} catch {
				await message.reply('You have dms disabled, please enable them.')
			}
			return 0
		})
	)
)
