import React from "react";
import "./style.css";

export default class Toast extends React.Component
{
    static defaultProps =
    {
        message : "",
        duration : 3, /*显示时间,单位秒*/
        trigger : null,
        scene : "normal", /*场景, normal / info / warn / notice */
    };

    trigger  = null;

    constructor (props)
    {
        super(props);

        this.state =
        {
            scene   : props.scene,
            message : props.message,
            duration: props.duration,
            show : false
        };

        if (typeof props.trigger === "function")
        {
            this.trigger  = props.trigger;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (!prevState.show && this.state.duration > 0)
        {
            if (window.tt)
            {
                window.clearTimeout(window.tt);
            }

            window.tt = setTimeout(() =>
            {
                this.setState({show:false});
                this.trigger && this.trigger();
                window.clearTimeout(window.tt);
            }, prevState.duration * 1000);
        }
    }

    componentDidMount()
    {
        window.Toast = this.showToast;
    }

    render()
    {
        return <div className={"message-toast" + (this.state.show ? " show" : "")}>
            <div className={"message-toast-wrapper " + this.state.scene}>
                <i className="fas fa-info-circle"/> {this.state.message || "？><？"}
            </div>
        </div>
    }

    showToast = (scene, message, trigger, duration) =>
    {
        if (scene === null)
        {
            this.setState({show:false});
        }
        else if (false === this.state.show && typeof message === "string" && message !== "")
        {
            let state =
            {
                message  : message,
                scene    : -1 < ["normal", "info", "warn", "notice"].indexOf(scene) ? scene : this.props.scene,
                duration : typeof duration === "number" ? duration : this.props.duration,
                show     : true
            };

            if(typeof trigger === "function")
            {
                this.trigger = trigger;
            }

            this.setState(state);
        }
    };
}