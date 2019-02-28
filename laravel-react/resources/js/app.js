/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./components/Example');

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import Master from './components/MasterPost';
import CreatePost from './components/CreatePost';
import DisplayPost from './components/DisplayPost';
import UpdatePost from './components/UpdatePost';

render(
    <Router history={browserHistory}>
        <Route path={"/"} component={Master}>
            <Route path={"/add-item"} component={CreatePost}/>
            <Route path={"/display-item"} component={DisplayPost}/>
            <Route path={"/edit/:id"} component={UpdatePost}/>
        </Route>
    </Router>, document.getElementById('crud-app')
);
