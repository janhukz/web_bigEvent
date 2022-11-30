$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    q = {
        pagenum: 1, //	页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()

    // 初始化文章列表表格数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                // *********接口返回的数据都是空*************
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                return layer.msg(res.message)

                // 使用模板引擎渲染数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 文章列表渲染后,调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 帅选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中的值,下拉选择框获取值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 给查询参数赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的值,再次查询数据
        initTable()
    })

    // 分页函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器ID
            count: 50, //数据总数,从服务端得到,目前为假数据,后期接口恢复了使用total
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时，触发jump回调
            // 触发jump回调的方式有两种：
            // 1. 点击页码的时候，会触发jump回调
            // 2. 只要调用了 laypage.render() 方法，就会触发jump回调
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                q.pagenum = obj.curr

                // 把最新的条目数，传给查询参数对象
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    renderPage()

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len)
            // 获取到文章的 id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了,则让页码值 -1 之后,
                        // 再重新调用 initTable 方法
                        // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})