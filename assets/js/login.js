$(function() {
    // 点击去注册链接
    $('#link_reg').click(function(e) {
        e.preventDefault()
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录按钮
    $('#link_login').click(function(e) {
        e.preventDefault()
        $('.login-box').show()
        $('.reg-box').hide()
    })

    let form = layui.form
    let layer = layui.layer

    // 表单正则校验
    form.verify({
        // 密码框
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 形参value是表单的值
        cfmpwd: function(value) {
            // 获取第一个密码框的值
            let pwd = $('.reg-box [name=password]').val()

            // 两个密码框的值进行比较
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 注册请求
    $('#reg-form').submit(function(e) {
        e.preventDefault()
        $.post('/api/reguser', {
            username: $('#reg-form [name=username]').val(),
            password: $('#reg-form [name=password]').val(),
        }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message)

            // 注册成功后，自动跳转
            $('#link_login').click()
        })
    })

    // 登录请求
    $('#login-form').submit(function(e) {
        e.preventDefault()

        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg(res.message)

                // 将token存入localStorage中
                localStorage.setItem('token', res.token)

                // 登录成功后，页面自动跳转到主页
                location.href = '../index.html'
            }
        })
    })


})