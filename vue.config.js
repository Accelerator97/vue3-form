const MonocoWebpackPlugin = require("monaco-editor-webpack-plugin")
const CircularDependencyPlugin = require('circular-dependency-plugin')
module.exports = {
  lintOnSave: false,
  chainWebpack(config){
    config.plugin('monaco').use(new MonocoWebpackPlugin())
    config.plugin('circular').use(new CircularDependencyPlugin())
  }
}

