import React, {Component} from 'react';
import {Router, Route, Link} from 'react-router';

class MasterPost extends Component {
    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="https://www.bear777.com">bear777.com</a>
                        </div>
                        <ul className="nav navbar-nav">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="add-item">Create Post</Link></li>
                            <li><Link to="display-item">Post List</Link></li>
                        </ul>
                    </div>
                </nav>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default MasterPost;