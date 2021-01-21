$(function () {
    //为 art -template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        
        return y + "-" + m +"-"+ d +" " + hh + ":"+mm + ":"+ss
    }
    //在个位数左侧填充0
    function padZero(n) {
        return n >9 ? n : '0'+n
    }


    // 1.定义提交参数
    var q = {
        pagenum: 1,     //页码值
        pagesize: 2,    //每页显示多少条数据
        cate_id: "",    //文章分类的Id
        state:"",       //文章的状态.可选的值有:已发布,草稿
    }
    //2.初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 更新成功后,重新渲染页面里的数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                //调用分页
                renderPage(res.total)
            }
        })
    }
    //3.初始化类别
    var form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值，渲染form
                var htmlStr = template("tpl-cate", res);
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染
                form.render();
            }
        })
    }
    //4.筛选功能
    $('#form-search').on("submit", function (e) {
        e.preventDefault();
        //获取
        var state = $('[name =state ]').val();
        var cate_id = $('[name =cate_id]').val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        initTable();
    })
    //5.分页(layui的内置模块:分页中可查询到)
    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页几条
            curr: q.pagenum,  //第几页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、skip（快捷跳页区域）
            //上述 元素的先后顺序有讲究
            limits: [2, 3, 5, 10],
            
                //触发jump:分页初始化时,页码改变
                jump: function(obj, first){
                  //obj包含了当前分页的所有参数，first 是否第一次初始化
                    //改变当前页
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                  //首次不执行
                  if(!first){
                    //初始化文章列表
                    initTable();
                  }
                }   
        });
    }
    // 6.删除
    var layer = layui.layer;
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id");
        //6.1显示对话框
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 更新成功后,重新渲染页面里的数据
                    initTable();
                    layer.msg("文章类别删除成功!");
                    // layer.close(index);
                    if ($(".btn-delete").length == 1 && q.pagenum > 1)
                        q.pagenum--
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})