import React from "react";
import "../styles/app.css";
import {HashRouter} from "react-router-dom";
import Horizontal from "./base/horizontal";
import Vertical from "./base/vertical";
import AppRoutes from "./routes";
import Nav from "./nav/index";
import Logo from "./logo/index";
import Toast from "./base/message/toast/index";

import Header from "./header/index";

export default class Main extends React.Component
{
    render()
    {
        return <HashRouter>
            <Horizontal className="container">
                <Vertical className="left-panel">
                    <Logo/>
                    <Nav/>
                </Vertical>

                <Vertical className="right-panel">
                    {/*头部*/}
                   <Header/>
                   {/*内容*/}
                    <div className="content">
                        <AppRoutes/>
                        <Toast/>
                    </div>
                </Vertical>
            </Horizontal>
        </HashRouter>;
    }

    /*组件加载完成*/
    componentDidMount()
    {
        window.left = this.left;
    }

    /*处理左侧显示和折叠*/
    left = () =>
    {

    };
}