const path = require('path');

module.exports = {
    entry: './background.js', // 入口文件
    devtool: 'source-map', // 使用 source-map 而不是 eval

    output: {
        filename: 'bundle.js', // 输出文件名
        path: path.resolve(__dirname, 'dist'), // 输出路径
    },
    mode: 'development', // 开发模式
};