// gulp 的入口文件
// 因为是运行在nodejs环境当中，我们可以使用commonjs的规范
// exports.foo = () => {
//     console.log('foo task working')
// }
// 直接运行 yarn gulp foo 会报错，因为其取消了同步模式，默认所有都为异步模式
exports.foo = done => {
    console.log('foo task working~')
    done() // 标识任务完成
}
// 默认任务，直接执行 yarn gulp 命令
exports.default = done => {
    console.log('default task working~')
    done() // 标识任务完成
}
// 在 gulp 4.0 以前，注册模块，是使用gulp里的方法去注册的
const gulp = require('gulp')
gulp.task('bar', done => {
    console.log('bar task working~')
    done()
})
// ---- 上面这种方法已经废弃，虽然还可以使用，但是不建议使用这种方法

// 创建组合任务
const { series, parallel } = require('gulp')
const task1 = done => {
    setTimeout(() => {
        console.log('task1 working~')
        done()
    }, 1000)
}
const task2 = done => {
    setTimeout(() => {
        console.log('task2 working~')
        done()
    }, 1000)
}
const task3 = done => {
    setTimeout(() => {
        console.log('task3 working~')
        done()
    }, 1000)
}
// 创建串行任务
exports.serialCombineTasks = series(task1, task2, task3)
// 创建并行任务
exports.parallelCombineTasks = parallel(task1, task2, task3)

// Gulp 异步任务的三种方式
// 方式一，通过回调的方式
exports.callback = done => {
    console.log('callback task')
    done()
}
// 错误优先的回调函数，给回调函数的第一个参数指定一个错误对象
// 如果多任务执行，一个错了，后面就不会继续执行了
exports.callback_error = done => {
    console.log('callback_error task')
    done(new Error('task failed'))
}

// 方式二，promise方案
exports.promise = () => {
    console.log('promise task~')
    return Promise.resolve()
}
exports.promise_error = () => {
    console.log('promise_error task~')
    return Promise.reject(new Error('task failed~'))
}

// 方式三，async await
// node 版本在 8 以上
const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
exports.async = async () => {
    await timeout(2000)
    console.log('async task~')
}
// 文件复制， readStream 也是一个异步任务
const fs = require('fs')
exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('package.json.txt')
    readStream.pipe(writeStream)
    return readStream
}
// ======> 等同于
exports.streamCopy = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('package.json.txt')
    readStream.pipe(writeStream)
    readStream.on('end', () => {
        done()
    })
}

// Gulp 构建过程核心工作原理
// 大多是将文件读取后，经过一些转换，最后写入到另外一个位置
// 下面来模拟实现 （压缩css）
const { Transform } = require('stream')
exports.simulation = () => {
    // 文件读取流
    const read = fs.createReadStream('simulationTest/normalize.css')
    // 文件转换流
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            // 核心转化过程实现
            // chunk => 读取流中读取到的内容 (Buffer)
            const input = chunk.toString()
            const outPut = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
            callback(null, outPut)
        }
    })
    // 文件写入流
    const write = fs.createWriteStream('simulationTest/normalize.min.css')
    // 把读取出来的文件流，经过转换流后，导入写入文件流
    read.pipe(transform).pipe(write)
    // 让 gulp 根据流的状态判断是否结束
    return read
}
// gulp 的官方定义是
// The streaming build system 流式构建系统

// gulp 文件操作 API + 插件的使用
// 虽然node提供的有文件操作的方法，但是gulp提供了更为强大的文件读写操作的API
const { src, dest } = require('gulp')
// 压缩css代码
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')
// src 为读取流 dest 为写入流
exports.gulpFile = () => {
    return src('gulpFileApi/*.css')
        .pipe(cleanCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('gulpFileAPiDist'))
}
