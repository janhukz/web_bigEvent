$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 密码长度规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        samePwd: function(value) {
            if (value === $('.layui-form [name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },

        rePwd: function(value) {
            if (value !== $('.layui-form [name=newPwd]').val()) {
                return '两次密码输入不一致！'
            }
        }
    })


    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 密码修改成功后，清空输入框
                // 转为原生dom，调用表单的reset方法清空输入框
                $('.layui-form')[0].reset()
            }
        })
    })

})