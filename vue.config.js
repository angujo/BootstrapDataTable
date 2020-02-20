module.exports = {
  chainWebpack: config => {
    config.externals({
      "vue-fragment": 'vue-fragment',
      axios: 'axios',
      lodash: {
        commonjs2: 'lodash',
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_' // indicates global variable
      }
    })
  }
};
