// Grunt 的入口文件

// 用于定义一些需要 grunt 自动执行的任务
// 需要导出一个函数
// 此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

module.exports = grunt => {
    // 创建 foo 命令，随后在命令行执行 yarn grunt foo
    grunt.registerTask('foo', () => {
        console.log('hello grunt~')
    })
    // 参数2[可选] 可以自定义任务描述，通过 yarn grunt --help 可以查看
    grunt.registerTask('bar', '任务描述', () => {
        console.log('other grunt~')
    })
    // 如果命名为 default 将作为默认任务，直接运行 yarn grunt 即可
    // grunt.registerTask('default', () => {
    //     console.log('default grunt~')
    // })
    // 一般我们使用 default 去执行多个任务
    // grunt.registerTask('default', ['foo', 'bar'])
    // grunt 默认支持同步模式，但是如果想要支持异步模式，则需要使用 this 的 async
    // grunt.registerTask('async-task', () => {
    //     setTimeout(() => {
    //         console.log('async task workding~')
    //     }, 1000);
    // })
    // 因为需要使用到 this ，这里就不能再使用 箭头函数了
    grunt.registerTask('async-task', function() {
        const done = this.async()
        setTimeout(() => {
            console.log('async task workding~')
            done() // 使用 done() 标记结束
        }, 1000);
    })
    // 标记错误 使用 return false
    grunt.registerTask('bad', () => {
        console.log('bad working~')
        return false
    })
    grunt.registerTask('task1', () => {
        console.log('task1~')
    })
    grunt.registerTask('task2', () => {
        console.log('task2~')
    })
    // 运行到失败的任务时，后面的任务就不会再运行了
    // 如果想让所有的任务都继续运行需要在命令后面添加 --force 参数
    // yarn grunt --force
    grunt.registerTask('default', ['task1', 'bad', 'task2'])
    // 标记异步失败任务 done() 中传入false参数
    grunt.registerTask('bad-async', function() {
        const done = this.async()
        setTimeout(() => {
            console.log('bad async')
            done(false)
        }, 1000);
    })

    // 配置选项方法
    grunt.initConfig({
        a: 'aaa',
        b: {
            b1: 'b1',
            b2: 123
        }
    })
    grunt.registerTask('a', () => {
        console.log(grunt.config('a')) // aaa
    })
    grunt.registerTask('b', () => {
        console.log(grunt.config('b')) // { b1: 'b1', b2: 123 }
        console.log(grunt.config('b.b1')) // b1
    })

    // 多目标任务
    // 通过配置同名任务实现
    grunt.initConfig({
        build: {
            options: {
                // 作为任务的配置选项
                foo: 'foo'
            },
            sit: {
                // 可以自定义 覆盖
                options: {
                    foo: 'sit'
                }
            },
            uat: 2
        }
    })
    // 多目标模式，可以让任务根据配置形成多个子任务
    grunt.registerMultiTask('build', function() {
        console.log('build task');
        console.log(`target: ${this.target}, data: ${this.data}`)
        console.log(this.options())
    })

    // grunt 插件的使用
    // 因为很多构建任务都是通用的，所以社区中有很多预设的插件
    
}