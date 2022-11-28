$.ajaxPrefilter(function(options) {
    // console.log(options);
    options.url = 'http://www.liulongbin.top:3007' + options.url

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    options.complete = function(res) {

        // 处理没有token越权访问的问题
        // console.log(res)
        if (res.responseJSON.status === 1) {
            // 1.强制清空token
            localStorage.removeItem('token')

            // 2. 强制跳转到登录
            location.href = '../login.html'
        }
    }
})