const transformer = require('react-native/packager/transformer');

module.exports = (data, callback) => {
  // Skip transpiling libraries that run without transpilation:
  //  * AmmoNext: a massive JS file produced by emscripten
  //  * three.js: Already compiled
  //  * three-orbit-controls: unused
  if (/[\/\\]node_modules[\/\\](ammonext|lodash|three)[\/\\]/.test(data.filename)) {
    callback(null, { code: data.sourceCode });
  } else {
    transformer(data, callback);
  }
};
