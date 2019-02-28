import React from "react";
import AddConfig from "./__";
import {SubData} from "../__";
import Area from "../../../core/base/area";
import Sub from "../../../core/nav/sub";
import Crumbs from "../../../core/crumbs";
import Radio from "../../../core/base/radio";
import Horizontal from "../../../core/base/horizontal";
import Validator from "../../../core/base/validator/index";
import Select from "../../../core/base/select/index";

//配置添加组件
export default class Add extends React.Component
{
    items ()
    {
        let items = [];

        AddConfig.inputs.forEach((v, k) =>
        {
            items.push(<div className="input-title" key={"-"+k}>{v.title}</div>);

            switch (v.type)
            {
                case "text": items.push(<input type="text" className="input" name={v.name} defaultValue={v.value || ""} placeholder={v.placeholder} key={"text-"+k} autoComplete="off"/>); break;
                case "textarea": items.push(<textarea type="textarea" className="textarea" name={v.name} defaultValue={v.value || ""} placeholder={v.placeholder} key={"textarea-"+k} autoComplete="off"/>); break;
                case "radio" : items.push(<Radio data={v.data} name={v.name} value={v.value} key={"radio-"+k}/>); break;
                case "select" :items.push(<Select options={v.options} name={v.name} defaultValue={v.value} style={{width:"150px"}} key={"select-"+k}/>);break;
                default : break;
            }
        });

        return items;
    }

    render ()
    {
        return <Horizontal className="full-height">

            {/*子导航*/}
            <Sub data={SubData}/>

            <div className="flex-grow">
                {/*面包屑*/}
                <Crumbs data={AddConfig.crumbs}/>

                <Area style={{marginTop:0}}>

                    <div className="form-inputs">

                        <form onSubmit={this.submit}>

                            {this.items()}

                            <br/>
                            <br/>

                            <button type="submit" className="btn btn-middle btn-normal">
                                <i className="fal fa-circle-notch fa-spin"/> 保存数据 <i className="fab fa-telegram-plane"/>
                            </button>

                        </form>
                    </div>
                </Area>
            </div>
        </Horizontal>
    }

    /*提交数据*/
    submit = (e) =>
    {
        e.preventDefault();

        let validator = new Validator();
        let check = validator.form(e).setRule(AddConfig.rules).check();

        if (!check)
        {
            window.Toast("warn", validator.getError());
            return false;
        }

        window.Toast("warn", "~");

    };
}