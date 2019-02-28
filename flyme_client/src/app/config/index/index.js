import React from "react";
import ListConfig from "./__";
import {SubData} from "../__";
import Horizontal from "../../../core/base/horizontal";
import Area from "../../../core/base/area";
import Sub from "../../../core/nav/sub";
import Crumbs from "../../../core/crumbs";
import DataList from "../../../core/list";
import Search from "../../../core/search";
import Client from "../../../core/base/you/Client";

//配置列表组件
export default class Index extends React.Component
{
    componentDidMount()
    {
        Client.get("http://127.0.0.1/api.php", { query:{a:100}, events : {
                "load" : (xhr, e) => { console.log("load", xhr, e); },
                "loadstart" : (xhr, e) => { console.log("loadstart", xhr, e); },
                "progress" : (xhr, e) => { console.log("loadstart", xhr, e); }
            } }).then(fulfilled =>
        {
            console.log("--- fulfilled  ----", fulfilled)
        }).state(state =>
        {
            if (state < 4)
            {
                // window.Toast("info", "Loading...", ()=>
                // {
                //
                // }, 1);
            }

            console.log("---- state ----", state);
        });
    }

    render ()
    {
        return <Horizontal className="full-height">

            {/*子导航*/}
            <Sub data={SubData}/>

            <div className="flex-grow" style={{width:"0px"}}>
                {/*面包屑*/}
                <Crumbs data={ListConfig.crumbs}/>

                <Area style={{marginTop:0}}>
                    <Search inputs={ListConfig.search}/>

                    <DataList cols={ListConfig.cols} data={ListConfig.data} checkbox={{enabled:true, listen:this.checkbox, field:"name"}}/>
                </Area>
            </div>
        </Horizontal>
    }

    /**
     * Checkbox处理
     */
    checkbox = (e, result) =>
    {
        console.log(e.currentTarget.value, result, "<--");
    };
}