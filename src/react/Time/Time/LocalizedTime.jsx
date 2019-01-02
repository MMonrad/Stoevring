import React, { Component } from 'react';
import moment from "moment-timezone";

export default class LocalizedTime extends Component {
    componentWillMount() 
    {
        this._time = this.props.time.clone(); 
        this._time.local();
    }

    render()
    {
        return (
            <span>{this._time.format('HH:mm')}</span>
        );
    }
}