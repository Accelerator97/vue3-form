const MonocoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const isLib = process.env.TYPE === "lib";
// 通过npm run serve启动的应用会添加TYPE 的环境变量，值为lib
module.exports = {
  lintOnSave: false,
  chainWebpack(config) {
    if (!isLib) {
      config.plugin("monaco").use(new MonocoWebpackPlugin());
    }
    config.plugin("circular").use(new CircularDependencyPlugin());
  },
};
