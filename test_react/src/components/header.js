import React, {Component} from 'react'

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayFlag: false
        };
        this.clickShow = this.clickShow.bind(this);
    };

    clickShow() {
        this.setState({
            displayFlag: !this.state.displayFlag
        });
    };

    render() {
        let showDiv = {
            display: this.state.displayFlag ? 'block' : 'none'
        };
        return (
            <div>{this.props.name}
                <div className="button" onClick={this.clickShow}>按钮</div>
                <div className="hides" style={showDiv}>内容</div>
            </div>
        )
    };
}