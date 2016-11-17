module.exports = {
  getTransformModulePath() {
    return require.resolve('./scripts/transformer');
  },
};
