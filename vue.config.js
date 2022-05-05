const MonocoWebpackPlugin = require("monaco-editor-webpack-plugin")

module.exports = {
  lintOnSave: false,
  chainWebpack(config){
    config.plugin('monaco').use(new MonocoWebpackPlugin())
  }
}

