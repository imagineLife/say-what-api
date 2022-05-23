function makeConnectionString({ username, pw, host, port, authDB }) {
  // Error Handling
  if (typeof host === 'undefined' || typeof port === 'undefined') {
    throw new Error(
      `Cannot create db connection with missing param: host: ${host}, port: ${port}`
    );
  }
  if (!process.env.MONGO_AUTH && (!username || !pw || !authDB)) {
    throw new Error('Cannot create db connection with missing param');
  }

  // no auth?!
  if (process?.env?.MONGO_AUTH?.toString() === 'false') {
    return `mongodb://${host}:${port}/?connectTimeoutMS=2500`;
  }

  //auth'd
  return `mongodb://${username}:${pw}@${host}:${port}/?authSource=${authDB}`;
}

module.exports = {
  makeConnectionString,
};
