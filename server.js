require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const needle = require('needle')

// this is the ID for @mttsrgnt
const userId = 380051971
const url = `https://api.twitter.com/2/users/${userId}`
const bearerToken = process.env.TWITTER_API_BEARER_TOKEN

const getFollowersFollowing = async () => {
    let params = {
        'user.fields': 'public_metrics',
    }

    const options = {
        headers: {
            'User-Agent': 'v2FollowersJS',
            authorization: `Bearer ${bearerToken}`,
        },
    }

    try {
        const resp = await needle('get', url, params, options)

        if (resp.statusCode != 200) {
            console.log(
                `${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`
            )
            return
        }

        const { data } = resp.body
        const { followers_count: followers, following_count: following } =
            data.public_metrics
        return { followers, following }
    } catch (err) {
        throw new Error(`Request failed: ${err}`)
    }
}

fastify.get('/', (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header('Access-Control-Allow-Methods', 'GET')

    return { data: 'hi' }
})

fastify.get('/followers', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header('Access-Control-Allow-Methods', 'GET')

    const { followers, following } = await getFollowersFollowing()
    return { followers, following }
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
