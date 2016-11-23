const transformer = require('react-native/packager/transformer');

module.exports = (data, callback) => {
  // Skip transpiling libraries that run without transpilation:
  //  * AmmoNext: a massive JS file produced by emscripten
  //  * WHS: already transpiled
  if (/\/node_modules\/(ammonext|lodash|three|three-orbit-controls)\//.test(data.filename)) {
    callback(null, { code: data.sourceCode });
  } else {
    transformer(data, callback);
  }
};
