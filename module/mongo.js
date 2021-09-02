const { MongoClient } = require('mongodb')

const mongoDbUrl = 'mongodb://localhost:27017'

const client = new MongoClient(mongoDbUrl)

async function mongo(){
    try {
        await client.connect()

        const db = await client.db('news-page')

        const users = db.collection('users')
        const posts = db.collection('posts')

        return {
            users,
            posts
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongo