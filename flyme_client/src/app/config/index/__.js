import React from "react";
import {status} from "../__";

//配置列表
export default
{
    //面包屑配置
    crumbs : [{title:"配置列表"}],

    // 配置列表头部信息
    cols :
    [
        {name:"cover", title:"图片", style:{width:"80px"}, hover:true, image:true},
        {name:"title", title:"配置名称", style:{width:"200px"}, hover:true},
        {name:"name",  title:"配置标识", style:{width:"100px"}},
        {name:"tag",   title:"配置标签", style:{width:"300px"}},
        {name:"type",  title:"配置类型", style:{width:"300px"}},
        {name:"sort",  title:"排序", style:{width:"300px"}},
        {name:"status",  title:"状态"},
        {name:"action",  title:"操作", style:{width:"100px"}},
    ],

    // 测试数据
    data : [
        {
            cover : "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1421292523,3593943696&fm=111&gp=0.jpg",
            title : "数据库地址和端口号配置数据库地址和端口号配置",
            name : "host1",
            tag  : "数据库",
            type : "文本表单",
            sort : 10,
            status : "正常",
            action : <span className="list-link"><a href="/">编辑</a> / <a href="/">删除</a></span>
        },
        {
            cover : "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1421292523,3593943696&fm=111&gp=0.jpg",
            title : "数据库地址和端口号配置数据库地址和端口号配置",
            name : "host2",
            tag  : "数据库",
            type : "文本表单",
            sort : 10,
            status : "正常",
            action : <span className="list-link"><a href="/">编辑</a> / <a href="/">删除</a></span>
        },
        {
            cover : "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1421292523,3593943696&fm=111&gp=0.jpg",
            title : "数据库地址和端口号配置数据库地址和端口号配置",
            name : "host3",
            tag  : "数据库",
            type : "文本表单",
            sort : 10,
            status : "正常",
            action : <span className="list-link"><a href="/">编辑</a> / <a href="/">删除</a></span>
        },
        {
            cover : "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1421292523,3593943696&fm=111&gp=0.jpg",
            title : "数据库地址和端口号配置数据库地址和端口号配置",
            name : "host4",
            tag  : "数据库",
            type : "文本表单",
            sort : 10,
            status : "正常",
            action : <span className="list-link"><a href="/">编辑</a> / <a href="/">删除</a></span>
        },
        {
            cover : "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1421292523,3593943696&fm=111&gp=0.jpg",
            title : "数据库地址和端口号配置数据库地址和端口号配置",
            name : "host5",
            tag  : "数据库",
            type : "文本表单",
            sort : 10,
            status : "正常",
            action : <span className="list-link"><a href="/">编辑</a> / <a href="/">删除</a></span>
        },
    ],

    // 状态
    status :
    [

    ],

    // 搜索条件
    search :
    [
        {title:"配置标签", name:"tag", type:"text", width:150, readOnly:false},
        {title:"配置状态", name:"status", type:"select", width:150, defaultValue:1, options:status, extra:{scene:"A"}},
        {title:"配置选择", name:"type", type:"select", width:150, defaultValue:"ABC", options:["ABC", "DEF"], extra:{scene:"B"}},
        {title:"配置状态", name:"status", type:"select", width:150, defaultValue:1, options:status, extra:{scene:"A"}},
    ],
};