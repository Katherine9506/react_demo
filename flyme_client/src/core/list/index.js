import React from "react";
import "./style.css";
import Horizontal from "../../core/base/horizontal";
import Helper from "../base/helper";
import Checkbox from "../base/checkbox/index";
import Link from "react-router-dom/es/Link";

/*数据列表*/
export default class List extends React.Component
{
    static defaultProps =
    {
        /**
         * 默认单元样式
         */
        cellStyle :
        {
            width : "60px",
        },

        /**
         * 列表头部信息
         * [{name:"字段标识", title:"字段名称", style : {...}, hover:false, image:false}, ... ]
         */
        cols : [],

        /**
          * 列表默认数据
          * [{name1:value1, name2:value2, ... }, ... ]
          */
        data : [],

        /**
         * 数据远程地址
         */
        src  : null,

        /**
         * 查询参数
         */
        query : {},

        /**
         * 显示数据编号
         */
        showIndex : true,

        /**
         * 使用CheckBox
         */
        checkbox :
        {
            /**
             * 是否使用checkbox
             */
            enabled:false,

            /**
             * Checkbox 操作处理
             */
            listen:null,

            /**
             * 关联字段
             */
            field:null
        },

        /**
         * 默认编号字段名称
         */
        indexName : "__INDEX__"
    };

    /**
     * 样式词典
     * {field:{style:{}, hover:false, image: false}, ...}
     */
    options      = {};

    /**
     * Checkbox ref标识
     */
    checkboxRefs = [];

    /**
     * Checkbox 选择结果
     * ["A", "C", ...]
     */
    checkResult  = [];

    /**
     * 构造函数
     */
    constructor (props)
    {
        super (props);

        if (props.cols.length === 0)
        {
            throw new Error ("请设置数据列表头部信息(cols)");
        }

        for (let i in props.cols)
        {
            if (props.cols.hasOwnProperty(i))
            {
                this.options[props.cols[i]["name"]] =
                {
                    style : Helper.merge(props.cellStyle || {},  props.cols[i]["style"] || {}),
                    hover : true === props.cols[i]["hover"],
                    image : true === props.cols[i]["image"]
                };
            }
        }

        if (props.showIndex === true)
        {
            this.options[props.indexName] = {style : props.cellStyle || {}, hover: false, image: false};
        }

        this.state =
        {
            /**
             * 列表数据
             * [{name1:value1, name2:value2, ... }, ... ]
             */
            data : props.data instanceof Array ? props.data : []
        };
    }

    /**
     * 列表头部
     */
    header = (data) =>
    {
        let cols = [];

        if (this.props.checkbox.enabled === true)
        {
            cols.push({title:<Checkbox change={this.checkAll}/>, name:this.props.indexName});
        }

        if (this.props.showIndex === true)
        {
            cols.push({title:"序号", name:this.props.indexName});
        }

        return <Horizontal className="list-row">
            {cols.concat(data).map((v, k) => <div className="list-cell" key={k} style={this.options[v.name].style}>{v.title}</div>)}
        </Horizontal>
    };

    /**
     * 数据列表
     */
    body = (data) =>
    {
        let items = [];

        for (let i in data)
        {
            if (data.hasOwnProperty(i))
            {
                let cell = [];

                /*Checkbox*/
                if (this.props.checkbox.enabled === true)
                {
                    let ref = "checkbox" + i;

                    this.checkboxRefs.push(ref);

                    cell.push(<div className="list-cell" style={this.options[this.props.indexName].style || {}} key={ref}> <Checkbox ref={ref} extra={{ref:ref}} value={data[i][this.props.checkbox.field]} change={this.checkOne}/> </div>);
                }

                /*编号*/
                if (true === this.props.showIndex)
                {
                    cell.push(<div className="list-cell" style={this.options[this.props.indexName].style || {}} key={this.props.indexName+"-"+i}> {parseInt(i)+1} </div>);
                }

                for (let name in data[i])
                {
                    if (data[i].hasOwnProperty(name))
                    {
                        cell.push(<div className="list-cell" style={this.options[name].style || {}} key={name} title={this.options[name].hover ? data[i][name] : null}>
                            {this.options[name].image ? <div className="list-image"><img src={data[i][name]} alt="" width="100%" height="100%"/></div> : data[i][name]}
                        </div>);
                    }
                }

                items.push(<Horizontal className="list-row" key={"row-"+i}> {cell} </Horizontal>);
            }
        }

        if (items.length === 0)
        {
            items.push(<Horizontal className="list-row" key="list-empty"> <div className="list-empty"> 数据为空~ </div> </Horizontal>);
        }
        else
        {
            items.push(<Horizontal className="list-row" key="list-more"> <div className="list-more"> <Link to="/"> 点击加载更多(3/20/1000)</Link> </div> </Horizontal>);
        }

        return items;
    };

    /**
     * Checkbox批量选择
     */
    checkAll = (e) =>
    {
        for (let i in this.checkboxRefs)
        {
            if (this.checkboxRefs.hasOwnProperty(i))
            {
                if (e.currentTarget.checked !== this.refs[this.checkboxRefs[i]].refs[this.checkboxRefs[i]].checked)
                {
                    this.refs[this.checkboxRefs[i]].refs[this.checkboxRefs[i]].click();
                }
            }
        }
    };

    /**
     * Checkbox选择事件
     */
    checkOne = (e) =>
    {
        let pos = this.checkResult.indexOf(e.currentTarget.value);

        if (e.currentTarget.checked)
        {
            if (-1 === pos) this.checkResult.push(e.currentTarget.value);
        }
        else
        {
            if (-1 < pos)
            {
                this.checkResult.splice(pos, 1);
            }
        }

        if (typeof this.props.checkbox.listen === "function")
        {
            this.props.checkbox.listen(e, this.checkResult);
        }
    };

    render()
    {
        return  <div className="list">

            <div className="list-header">
                {this.header(this.props.cols)}
            </div>

            <div className="list-body">
                {this.body(this.state.data)}
            </div>
        </div>
    }

    componentDidMount()
    {

    }
}