import fastify from 'fastify';
import { getUserFollowersById } from './controllers/getUserFollowersById.js';
import { getUserFollowersByUsername } from './controllers/getUserFollowersByUsername.js';

const server = fastify();

server.get('/followers/by/id/:userId', async (request, reply) => {
  const { userId } = request.params;
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET');

  const { followers, following } = await getUserFollowersById(userId);
  return { followers, following };
});

server.get('/followers/by/username/:username', async (request, reply) => {
  const { username } = request.params;
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET');

  const { name, handle, followers, following } =
    await getUserFollowersByUsername(username);

  return { name, handle, followers, following };
});

server.get('/', (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET');

  return { message: 'hi' };
});

// Run the server!
const start = async () => {
  try {
    await server.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log('server running');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
