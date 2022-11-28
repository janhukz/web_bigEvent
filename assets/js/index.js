$(function() {
    let layer = layui.layer
    $('#sign_out').click(function(e) {
        e.preventDefault()
        console.log(1)
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token')
            location.href = '../index.html'
            layer.close(index);
        });
    })

    getUserInfo()
})


function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',

        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },

        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            renderAvatar(res.data)
        },

        // 不管请求成功还是失败都执行回调
        // complete: function(res) {

        //     // 处理没有token越权访问的问题
        //     console.log(res)
        //     if (res.responseJSON.status === 1) {
        //         // 1.强制清空token
        //         localStorage.removeItem('token')

        //         // 2. 强制跳转到登录
        //         location.href = '../login.html'
        //     }
        // }
    })
}


function renderAvatar(user) {
    // 渲染用户名
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 判断用户是否有头像，如果有则显示用户上传的头像，没有则把用户名第一个字母渲染为头像
    if (user.user_pic !== null) {
        //渲染用户头像，且隐藏文字头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text_avatar').hide()
    } else {
        // 使用首字母 注意转大写
        let firstchar = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text_avatar').html(firstchar)
    }
}