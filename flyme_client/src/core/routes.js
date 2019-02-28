import React from "react";
import {Switch, Route} from "react-router-dom";
import NotFound from "./error/notfound";
import Index from "../app/index/index";
import ConfigInfo from "../app/config/info/index";
import ConfigAdd from "../app/config/add/index";
import ConfigIndex from "../app/config/index/index";

export default () =>
{
    return <Switch>
        <Route path="/" exact={true} component={Index}/>
        <Route path="/config" exact={true} component={ConfigIndex}/>
        <Route path="/config-add" exact={true} component={ConfigAdd}/>
        <Route path="/config-info" exact={true} component={ConfigInfo}/>
        <Route component={NotFound}/>
    </Switch>
};