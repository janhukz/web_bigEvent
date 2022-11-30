$(function() {
    let layer = layui.layer
    let form = layui.form

    initArtCateList()



    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {

                // 渲染模板
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    let index = null

    $('#btnAddCate').click(function() {
        index = layer.open({
            type: 1,
            title: '文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        })
    })

    // 由于当前form表单不是一开始就有的，所以需要通过代理的形势绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {

                console.log(res);

                if (res.status !== 0) {

                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList()
                layer.msg('新增文章分类成功！')
                layer.close(index)

            }
        })
    })

    // 通过代理的形式，给编辑按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {

        indexEdit = layer.open({
            type: 1,
            title: '文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html()
        })

        //弹出层后，根据ID获取填充对应数据
        let id = $(this).attr('data-Id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                //使用layui提供的方法填充表单数据
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理给form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message)
                }
                return layer.msg('更新分类信息成功！')
                layer.close(indexEdit)
                initArtCateList()

            }
        })
    })

    // 通过代理给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-del', function() {
        //弹出层后，根据ID获取填充对应数据
        let id = $(this).attr('data-Id')

        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()

            }
        })
    })
})