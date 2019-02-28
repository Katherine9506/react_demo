import React from "react";
import "./style.css";

export default class Tabs extends React.Component
{
    static defaultProps =
    {
        data:[], /*Tab数据, [{title:"", action:null}, ...]*/
        context:null, /*Tab上下文环境*/
    };

    render ()
    {
        return <div className="tabs">
            {this.props.data.map((v,k) => <div className="tab" data-active={v.name && 0 === k} key={k} tab={v.name}>{v.title}</div>)}
        </div>
    }
}