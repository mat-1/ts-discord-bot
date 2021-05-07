import { argument, literal } from 'node-brigadier'
import { dispatcher, UserArgument } from '../commands'
import Discord, { MessageEmbed } from 'discord.js'

dispatcher.register(
	literal<Discord.Message>('debugmember').then(
		argument<Discord.Message, Discord.User>('member', new UserArgument())
		.executes(async (context) => {
			const message = context.getSource()
			const member: Discord.User = context.getArgument('member')
			await message.channel.send(new MessageEmbed({
				description: `Found **${member.tag}**`
			}))
			return 0
		})
	)
)
