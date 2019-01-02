import React, { Component } from "react";
import moment from "moment-timezone";

export default class LocalizedDate extends Component {
    constructor(props)
    {
        super(props);
        this._format = "L";
        this._date = moment.Moment;
    }

    componentWillMount() 
    {
        this._date = this.props.date.clone(); 
        this._date.local();
    }

    render()
    {
        return (
            <span>{this._date.format(this._format)}</span>
        );
    }
}
