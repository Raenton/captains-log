exports.toCursorHash = (string) => Buffer.from(string).toString('base64');

exports.fromCursorHash = (string) =>
  Buffer.from(string, 'base64').toString('ascii');
