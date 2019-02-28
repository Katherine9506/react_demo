import React from "react";
import Config from "./_env";
import {Link} from "react-router-dom";
import ScrollBar from "../base/scrollbar";
import "./style.css";

/*导航菜单*/
export default class Index extends React.Component
{
    /*生成菜单*/
    nav = () =>
    {
        let div = [];

        for (let i in Config)
        {
            div.push(<div className="nav-title" key={"nt "+i} onClick={this.click} open={true === Config[i].open}>
                <i className={Config[i].icon + " icon-before"}/> {Config[i].title} <span className="nav-dot"/>
            </div>);

            let items = [];

            for (let ii in Config[i].items)
            {
                items.push(<Link className="nav-item" replace={true} to={Config[i].items[ii].link} key={"nts "+ii}>{Config[i].items[ii].title}</Link>);
            }

            div.push(<div className="nav-items" key={"nav "+i}> {items} </div>);
        }

        return div;
    };

    render ()
    {
        return <div className="nav">
            <ScrollBar showTrack={false}>
                {this.nav()}
            </ScrollBar>
        </div>
    }

    /*点击菜单*/
    click = (e) =>
    {
        false === e.currentTarget.hasAttribute("open") ? e.currentTarget.setAttribute("open", "") : e.currentTarget.removeAttribute("open");
    };
}