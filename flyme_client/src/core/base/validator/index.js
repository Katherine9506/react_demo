let R =
{
    /*整数*/
    integer:function(value)
    {
        return /^-?[1-9]\d*$/.test(value);
    },
    positive:function(value)
    {
        return this.integer(value) && value > 0;
    },
    negative:function(value)
    {
        return this.integer(value) && value < 0;
    },
    /*小数*/
    float:function(value)
    {
        return /^-?\d+(\.\d{1,3})?$/.test(value);
    },
    /*天数*/
    day:function (value)
    {
        return this.positive(value);
    },
    money:function (value)
    {
        return this.positive(value);
    },
    email:function(value)
    {
        return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/i.test(value);
    },
    mobile:function(value)
    {
        return /^1[3|4|5|7|8]\d{9}$/.test(value);
    },
    datetime:function(value)
    {
        return /^\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[1-2][0-9]|30|31)\s*((23|22|21|20|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])?$/.test(value);
    },
    postcode:function(value)
    {
        return /^\d{6}$/.test(value);
    },
    ipv4:function(value)
    {
        return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value);
    },
    domain:function(value)
    {
        return /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z\u4e00-\u9fff]+){1,2}$/i.test(value)
    },
    url:function(value)
    {
        return /^((http|https|ftp):)?\/\/([a-z0-9]+\.)*[a-z0-9]+(-*[a-z0-9]+)*(\.[a-z\u4e00-\u9fff]+){1,2}/i.test(value);
    },
    /*判断值是否在其中, range(1, [1, 2, 3]) */
    range:function(value, range)
    {
        for (let i in range)
        {
            if (value === range[i])
            {
                return true;
            }
        }

        return false;
    },
    /*v1>=v2*/
    gt:function (v1, v2)
    {
        return !(v2 === undefined || v1 <= v2);
    },
    /*v1<v2*/
    lt:function (v1, v2)
    {
        return !(v2 === undefined || v1 >= v2);
    },
    /*v2[0]<v1 && v2[1] > v1*/
    compare:function (v1, v2)
    {
        return !(v2[0] === undefined || this.lt(v1, v2[0]) || v2[1] === undefined || this.gt(v1, v2[1]));
    },
    /**
     * v1.length < v2[0]
     * or
     * v2[0]<=v1.length && v2[1] >= v1.length
     */
    length:function (v1, v2)
    {
        if(v2[0] !== undefined && v1.length < v2[0]) return false;
        return !(v2[1] !== undefined && v1.length > v2[1]);
    },
    regex:function(value, express)
    {
        return express.test(value)
    }
};

export default class Validator
{
    /**
     * 验证规则
     * 每个元素格式: {name:"", check:{require:"", mobile:"", email:"", length:["", [min, max]], belong:["", []], gt:["", 最小值],lt:["", 最大值]  ...}}
     */
    rules  = [];

    /**
     * 待验证数据
     * 每个元素格式:{name:value}
     */
    data   = {};

    /**
     * 表单元素
     */
    input  = {};

    /*错误信息*/
    error  = "";

    /*构造函数*/
    constructor (data, rules)
    {
        this.setData(data);
        this.setRule(rules);
    }

    /**
     * 设置规则
     * 数据格式:[{name:"", check:{require:"", mobile:"", email:"", ...}}, ...]
     */
    setRule (rules)
    {
        if (rules instanceof Array) this.rules = rules;
        return this;
    }

    /**
     * 设置数据
     * 数据格式:{name:value, ...}
     */
    setData (data)
    {
        this.data = data;
        return this;
    }

    /*返回数据*/
    getData ()
    {
        return this.data;
    }

    /*返回数据*/
    getFormData ()
    {
        let formData = new FormData();

        for (let k in this.data)
        {
            formData.append(k, this.data[k]);
        }

        return formData;
    }

    /*返回错误信息*/
    getError ()
    {
        return this.error;
    }

    /**
     * 验证数据
     * scene:验证场景
     */
    check (scene)
    {
        scene = scene || "both";

        for (let index in this.rules)
        {
            let name = this.rules[index]["name"], value = this.data[name], rule_scene = this.rules[index]["scene"] || "both";

            /*跳过其他场景*/
            if (rule_scene !== scene && rule_scene !== "both")
            {
                continue;
            }

            if (value === undefined || value === "")
            {
                /*不是必填*/
                if (this.rules[index]["check"]["require"] === undefined) continue;
                /*必填验证*/
                this.error = this.rules[index]["check"]["require"] || "请填写字段:"+name;

                if (this.input[name] !== undefined)
                {
                    this.input[name].focus();
                }

                return false;
            }

            for (let key in this.rules[index]["check"])
            {
                if (key === "require")
                {
                    continue;
                }

                if (R[key] === undefined)
                {
                    this.error = "验证规则不存在:"+key;

                    if (this.input[name] !== undefined)
                    {
                        this.input[name].focus();
                    }

                    return false;
                }
                else if (key === "regex" || key === "range" || key === "length" || key==="compare" || key === "lt" || key === "gt")
                {
                    if (false === R[key](value, this.rules[index]["check"][key][1]))
                    {
                        this.error = this.rules[index]["check"][key][0] || "字段验证不通过:"+name;

                        if (this.input[name] !== undefined)
                        {
                            this.input[name].focus();
                        }

                        return false;
                    }
                }
                else
                {
                    if (false === R[key](value))
                    {
                        this.error = this.rules[index]["check"][key] || "字段验证不通过:"+name;

                        if (this.input[name] !== undefined)
                        {
                            this.input[name].focus();
                        }

                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * 解析表单数据(不直接支持checkbox)
     * 参数e是submit事件对象
     */
    form(e)
    {
        if (e.type === undefined || e.type !== "submit") return this;

        this.data = [];

        for (let element of e.currentTarget.elements)
        {
            let name = element.name,  type = element.type;

            if (("" === name || null === name) || ("text" !== type && "hidden" !== type && "password" !== type && "textarea" !== type && "radio" !== type) || ("radio" === type && !element.checked))
            {
                continue;
            }

            this.data[name] = element.value;
            this.input[name] = element;
        }

        return this;
    }

    /**
     * 暴露规则
     */
    static rule = R;
}