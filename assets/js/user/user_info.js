$(function() {
    let form = layui.form
    let layer = layui.layer

    // 表单验证
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })


    initUserInfo()

    // 初始化用户资料
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                console.log(res);
                //给表单赋值
                form.val("userInfo", res.data);
            }
        })
    }

    //  重置表单
    $('#btnReset').click(function(e) {
        e.preventDefault()
        initUserInfo()
    })

    // 更新用户资料
    // 注意：是监听表单的sumbit事件，而不是按钮！
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})