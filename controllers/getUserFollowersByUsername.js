import needle from 'needle';

export async function getUserFollowersByUsername(username) {
  const url = `https://api.twitter.com/2/users/by/username/${username}`;

  let params = {
    'user.fields': 'public_metrics',
  };

  const options = {
    headers: {
      authorization: `Bearer ${process.env.TWITTER_API_BEARER_TOKEN}`,
    },
  };

  try {
    const resp = await needle('get', url, params, options);
    if (resp.statusCode != 200) {
      console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
      return;
    }

    const { data } = resp.body;

    const { name, username: handle } = data;

    const { followers_count: followers, following_count: following } =
      data.public_metrics;

    return { name, handle, followers, following };
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
}
