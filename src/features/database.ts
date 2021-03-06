import { Collection, Db, MongoClient, UpdateQuery } from 'mongodb'

interface MemberSchema {
	id: string
}

interface ServerSchema {
	rules?: { [ key: string ]: { content: string, id: string } }
}

let client: MongoClient
let database: Db
let membersCollection: Collection<MemberSchema>
let serverCollection: Collection<ServerSchema>


async function connect(): Promise<void> {
	if (!process.env.db_uri)
		throw Error('db_uri was not found in env')
	client = await MongoClient.connect(process.env.db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
	database = client.db(process.env.db_name)
	membersCollection = database.collection('members')
	serverCollection = database.collection('server')
}


export async function updateMember(memberId: string, query: UpdateQuery<MemberSchema> | Partial<MemberSchema>) {
	await membersCollection.updateOne(
		{ id: memberId },
		query,
		{ upsert: true }
	)
}

export async function updateServer(query: UpdateQuery<ServerSchema> | Partial<ServerSchema>) {
	await serverCollection.updateOne(
		{ _id: 'server-info' },
		query,
		{ upsert: true }
	)
}
export async function fetchServer(): Promise<ServerSchema> {
	return await serverCollection.findOne(
		{ _id: 'server-info' },
	)
}

// very specific things shouldn't be here!


connect().then(() => {
	// do setup stuff here maybe
})
