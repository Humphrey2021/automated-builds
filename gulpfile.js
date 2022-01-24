// gulp 的入口文件
// 因为是运行在nodejs环境当中，我们可以使用commonjs的规范
// exports.foo = () => {
//     console.log('foo task working')
// }
// 直接运行 yarn gulp foo 会报错，因为其取消了同步模式，默认所有都为异步模式
exports.foo = done => {
    console.log('foo task working')
    done() // 标识任务完成
}
// 默认任务，直接执行 yarn gulp 命令
exports.default = done => {
    console.log('default task working')
    done() // 标识任务完成
}
