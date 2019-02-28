import React, {Component} from "react";
import PropTypes from 'prop-types'

class NaviItem extends Component {
    render() {
        const mainStyle = {
            backgroundImage: `url(${this.props.item.backgroundImage})`,
            backgroundSize: "cover"
        };
        const titleStyle = {
            color: this.props.item.title.color,
        };
        return (
            <div className="navigation-item" style={mainStyle}>
                <span style={titleStyle}>{this.props.item.title.text}</span>
            </div>
        );
    }
}

class NavigationItemEditor extends Component {
    render() {
        const item = this.props.item;

        return (
            <div className="navigation-items">
                <p>Navigation Item Edit:</p>
                标题：<br/>
                文本：<input type="text" value={item.title.text} name="text"
                          onChange={this.props.handleTitleChange}/>
                颜色：<input type="text" value={item.title.color} name="color"
                          onChange={this.props.handleTitleChange}/>
                <hr/>
            </div>
        );
    }
}

class NavigationEditor extends Component {
    render() {
        const basicStyle = this.props.basicStyle;

        return (
            <div>
                <p>Navigation Edit:</p>
                背景颜色：<input type="text" value={basicStyle.backgroundColor} name="backgroundColor"
                            onChange={this.props.handleBasicStyleChange}/>
            </div>
        );
    }
}

export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isEditing: false,
            currentItem: {},
            basicStyle: {backgroundColor: 'skyblue'},
        };
        this.navigationItemEditPopup = this.navigationItemEditPopup.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.createNewNaviItemHandler = this.createNewNaviItemHandler.bind(this);
        this.handleBasicStyleChange = this.handleBasicStyleChange.bind(this);
    }

    componentWillMount() {
        const items = ['娱乐', '外卖', '预约', '订购', '甩卖', 6, 7, 8];
        this.setState({
            items: items.map((item, index) => {
                return {
                    index: index,
                    title: {
                        text: item,
                        color: '#ef6a44',
                    },
                    icon: 'https://www.iconfont.cn/user/detail?spm=a313x.7781069.1998910419.dfa9d9a29&uid=123293',

                    backgroundImage: 'http://g.hiphotos.baidu.com/image/h%3D300/sign=a9eefda0a0345982da8ae3923cf5310b/9358d109b3de9c82ef6b905b6181800a18d843d3.jpg',
                };
            })
        });
    }

    navigationItemEditPopup(index, e) {
        this.setState({isEditing: true, currentItem: this.state.items[index]});
    }

    handleTitleChange(e) {
        let currentItem = this.state.currentItem;
        let items = this.state.items;
        currentItem.title[e.target.name] = e.target.value;
        items[currentItem.index] = currentItem;
        this.setState({
            items: items,
            currentItem: currentItem
        });
    }

    createNewNaviItemHandler(e) {
        let items = this.state.items;
        let newItem = {
            index: items.length,
            title: {
                text: '新导航',
                color: '#2b37ef',
            },
            icon: 'https://www.iconfont.cn/user/detail?spm=a313x.7781069.1998910419.dfa9d9a29&uid=123293',
            backgroundImage: 'http://g.hiphotos.baidu.com/image/h%3D300/sign=a9eefda0a0345982da8ae3923cf5310b/9358d109b3de9c82ef6b905b6181800a18d843d3.jpg',
        };
        items.push(newItem);
        this.setState({
            items: items,
            currentItem: newItem,
            isEditing: true,
        });
    }

    handleBasicStyleChange(e) {
        let basicStyle = Object.assign({}, this.state.basicStyle);
        basicStyle[e.target.name] = e.target.value;
        this.setState({basicStyle: basicStyle});
    }

    render() {
        return (
            <div className="navigation-root">
                <div className="navigation-preview">
                    <p>Navigation Test:</p>
                    <div className="navigation" style={this.state.basicStyle}>
                        <div className={"navigation items"}>
                            <ul>
                                {
                                    this.state.items.map(item => (
                                        <li onClick={this.navigationItemEditPopup.bind(this, item.index)}
                                            className="navigation-item li"
                                            key={item.index}>
                                            <NaviItem item={item}/></li>))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <NavigationEditor basicStyle={this.state.basicStyle}
                                  handleBasicStyleChange={this.handleBasicStyleChange}/>
                <hr/>
                {
                    this.state.isEditing &&
                    <NavigationItemEditor item={this.state.currentItem} handleTitleChange={this.handleTitleChange}/>
                }
                <button className="button primary" onClick={this.createNewNaviItemHandler}>Add Navigation Item</button>
            </div>
        );
    }
}