/**
 * 配置类型
 */
let configTypes =
[
    {title : "请选择", value:""},
    {title : "文本 - text", value:"text"},
    {title : "单选 - radio", value:"radio"},
    {title : "文件 - file", value:"file"},
    {title : "文本域 - textarea", value:"textarea"},
    {title : "下拉选项 - select", value:"select"},
];

//添加配置
export default
{
    //面包屑配置
    crumbs : [{title:"添加配置"}],

    //配置表单
    inputs :
    [
        {title:"配置名称", type:"text", name:"title", value:"", placeholder:""},
        {title:"配置值(选填)",   type:"textarea", name:"value", value:"", placeholder:""},
        {title:"配置类型", type:"select", name:"type", value:"", placeholder:"", options : configTypes},
        {title:"配置标签", type:"text", name:"tag", value:"", placeholder:""},
        {title:"配置描述", type:"textarea", name:"description", value:"", placeholder:""},
        {title:"配置排序(降序)", type:"text", name:"sort", value:"0", placeholder:"排序"},
        {title:"配置状态", type:"radio", name:"status", value:"1", placeholder:"", data:[{title:"启用", value:"1"}, {title:"禁用", value:"0"}]},
    ],

    //验证规则
    rules :
    [
        {name:"title", check:{require:"请填写配置名称"}},
        {name:"type",  check:{require:"请选择配置类型", compare:["配置类型不正确", ["text", "textarea", "radio", "select", "file"]]}},
        {name:"tag", check:{require:"请填写配置标签", regex:["配置标签由英文字母(a-z)、数字(0-9)、下划线(_)组成", /^[a-z]+(_?[a-z0-9]+)*$/]}},
        {name:"description", check:{require:"请填写配置描述", length:["配置描述最多10个字", 10]}},
        {name:"sort", check:{require:"请填写配置排序", integer:"请填写有效的配置排序"}},
        {name:"status", check:{require:"请选择配置状态"}},
    ],
};