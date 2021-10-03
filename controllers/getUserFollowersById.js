import needle from 'needle';

export async function getUserFollowersById(userId) {
  const url = `https://api.twitter.com/2/users/${userId}`;

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

    const { followers_count: followers, following_count: following } =
      data.public_metrics;

    return { followers, following };
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
}
