// let proxyObj = {}
//
// proxyObj['/']={
//     //websocket
//     ws:false,
//     //目标地址
//     target:'http://localhost:8081',
//     // target:'http://47.97.49.228:5035',
//     //发送请求host会被设置target
//     changeOrigin: true,
//     //不重写请求地址
//     pathRewrite:{
//         '^/': '/'
//     }
// }
//
//
// //将我们前端的8080请求,传递到后端8081去，解决跨域问题
//
// module.exports = {
//     devServer:{
//         host: 'localhost',
//         port: 8080,
//         proxy:proxyObj
//     }
// }
module.exports = {
    publicPath: './',
    devServer: {
        open: true,
        proxy: {
            '/': {
                target:'http://localhost:8081',
                // target:'http://47.97.49.228:5035',
                changeOrigin: true, //允许跨域
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    }
}