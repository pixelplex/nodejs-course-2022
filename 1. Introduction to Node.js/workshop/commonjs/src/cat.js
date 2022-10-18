const MEOW = 'meow';

exports.voice = n => `"${Array(n).fill(MEOW).join(' ')}"`;

