import { argument, literal } from 'node-brigadier'
import { dispatcher, UserArgument } from '../features/commands'
import Discord, { MessageEmbed } from 'discord.js'
import { commandHelp } from './help'

commandHelp['debugmember'] = 'This command is used for testing member matching'
commandHelp['debugmember <member>'] = 'This command is used for testing member matching'


dispatcher.register(
	literal<Discord.Message>('debugmember').then(
		argument<Discord.Message, Discord.User>('member', new UserArgument())
		.executes(async (context) => {
			const message = context.getSource()
			const member: Discord.User = context.getArgument('member')
			await message.reply(new MessageEmbed({
				description: `Found **${member.tag}**`
			}))
			return 0
		})
	)
)
