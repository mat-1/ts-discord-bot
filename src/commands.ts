import Brigadier, { ArgumentType, StringReader, Suggestions } from 'node-brigadier'
import { client, recentUsers } from '.'
import Discord from 'discord.js'

export const dispatcher: Brigadier.CommandDispatcher<Discord.Message> = new Brigadier.CommandDispatcher()

export class UserArgument implements ArgumentType<Discord.User> {
	id: string

	constructor(id?: string) {
		this.id = id
	}

	parse(reader: StringReader) {
		console.log('parsing')
		let nextWord: string = reader.getString().substring(reader.getCursor())

		// remove the stuff around mentions so it's just the id
		if (nextWord.startsWith('<@') && nextWord.endsWith('>'))
			nextWord = nextWord.substring(1, nextWord.length - 2)
			.replace(/^!/, '') // remove the exclamation point that appears if the user is nicked

		// numerical id
		if (isFinite(nextWord as unknown as number)) { // oh yeah it's typescript time
			reader.setCursor(reader.getCursor() + nextWord.length)
			return client.users.cache.get(this.id = nextWord)
		}

		// ok, the user didn't just put an id, so we have to test more stuff now

		const remaining = reader.getRemaining()
		const remainingSplit = remaining.split(' ')

		const allUsersMapped = client.users.cache
		const recentUsersMapped = Object.keys(recentUsers).map(userId => client.users.cache.get(userId))

		let foundUserId: string

		// search for username+discriminator
		if (remainingSplit.includes('#')) {
			for (let i = remainingSplit.length - 1; i >= 0; i --) {
				const checkString = remainingSplit.slice(0, i + 1).join(' ').toLowerCase()
				if (checkString.includes('#')) {
					foundUserId = allUsersMapped.find((u) => u.tag.toLowerCase() === checkString)?.id

					if (foundUserId) {
						reader.setCursor(reader.getCursor() + foundUserId.length)
						return client.users.cache.get(this.id = foundUserId)
					}
				}
			}
		}

		// search for recent members + exact username
		for (let i = remainingSplit.length - 1; i >= 0; i --) {
			const checkString = remainingSplit.slice(0, i + 1).join(' ').toLowerCase()
			foundUserId = recentUsersMapped.find((u) => u.username.toLowerCase() === checkString)?.id

			if (foundUserId) {
				reader.setCursor(reader.getCursor() + foundUserId.length)
				return client.users.cache.get(this.id = foundUserId)
			}
		}

		// search for recent members + start of username
		for (let i = remainingSplit.length - 1; i >= 0; i --) {
			const checkString = remainingSplit.slice(0, i + 1).join(' ').toLowerCase()
			foundUserId = recentUsersMapped.find((u) => u.username.toLowerCase().startsWith(checkString))?.id

			if (foundUserId) {
				reader.setCursor(reader.getCursor() + foundUserId.length)
				return client.users.cache.get(this.id = foundUserId)
			}
		}

		return null
	}

	listSuggestions(context, builder) {
		return Suggestions.empty()
	}

	getExamples() {
		return [
			'@mat',
			'224588823898619905'
		]
	}
}

// import all the commands here, this must be updated every time you add a new command
import './commands/ping'
import './commands/debugmember'

