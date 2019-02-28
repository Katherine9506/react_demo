import React, {Component} from 'react';

export default class FormSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectValue: '',
        };
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange(e) {
        this.setState({selectValue: e.target.value});
    }

    render() {
        const items = ['请选择', '足球', '棒球', '皮球', '篮球'];

        return (
            <form action="">
                <p>您选择了：{items[this.state.selectValue]}</p>
                <select name="test-select" value="0" onChange={this.handleOptionChange}>
                    {
                        items.map((item, index) =>
                            (<option key={index} value={index}>{item}</option>))
                    }
                </select>
            </form>
        );
    }
}