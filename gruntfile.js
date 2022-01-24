// Grunt 的入口文件

// 用于定义一些需要 grunt 自动执行的任务
// 需要导出一个函数
// 此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 API
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
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
    grunt.registerTask('async-task', function () {
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
    grunt.registerTask('bad-async', function () {
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
    grunt.registerMultiTask('build', function () {
        console.log('build task');
        console.log(`target: ${this.target}, data: ${this.data}`)
        console.log(this.options())
    })

    // grunt 插件的使用
    // 因为很多构建任务都是通用的，所以社区中有很多预设的插件
    // 举例安装 grunt-contrib-clean 插件，它用来自动清除项目在开发过程中产生的临时文件
    // 运行命令 yarn add grunt-contrib-clean 来安装它
    grunt.initConfig({
        clean: {
            // temp: 'temp/app.js' // 需要设置目标文件
            // temp: 'temp/*.txt' // 可以使用通配符，批量删除某类型文件
            temp: 'temp/**' // 删除temp下所有的子目录及文件
        }
    })
    grunt.loadNpmTasks('grunt-contrib-clean')
    // 执行 yarn grunt clean 命令，就可以实现清除文件操作

    // 继续看几个 Grunt 中比较常用的插件
    // 1. grunt-sass
    // 安装 yarn add grunt-sass sass --dev
    grunt.initConfig({
        sass: {
            options: {
                // 不写时运行 yarn grunt sass 会报错 （Fatal error: The implementation option must be passed to the Sass task）
                implementation: sass, // 需要指定使用 sass 去处理编译
                sourceMap: true // 添加 sourceMap 模块
            },
            main: {
                files: {
                    "dist/css/main.css": "src/scss/main.scss"
                }
            }
        },
        // 2. grunt-babel
        // yarn add grunt-babel @babel/core @babel/preset-env --dev
        babel: {
            main: {
                options: {
                    sourceMap: true, // 添加 sourceMap 模块
                    presets: ['@babel/preset-env'] // 自动将 ECMAScript 所有最新特性加载进来
                },
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        // 安装watch插件 yarn add grunt-contrib-watch --dev 用来监视文件的变化
        watch: {
            js: { // 监听js文件
                // files: ['scr/js/app.js']
                files: ['src/js/*.js'],
                tasks: ['babel'] // 当发生改变时，需要执行什么命令
            },
            css: { // 监听css文件
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            }
        }

    })
    // grunt.loadNpmTasks('grunt-sass')
    // grunt.loadNpmTasks('grunt-babel')
    // grunt.loadNpmTasks('grunt-contrib-watch')

    // 当引入的插件越来越多，我们会写越来越多的 grunt.loadNpmTasks
    // 这个时候可以安装社区中的 load-grunt-tasks. 运行yarn add load-grunt-tasks --dev
    loadGruntTasks(grunt) // 会自动加载所有的 Grunt 插件任务
    grunt.registerTask('default', ['sass', 'babel', 'watch'])
}