import React, { Component } from "react";
import moment from "moment-timezone";
import LocalizedTime from "src/react/Time/Time/LocalizedTime";
import LocalizedDate from "src/react/Time/Date/LocalizedDate";

export default class LocalizedDateTime extends Component {
    render()
    {
        return (
            <span>
                <LocalizedTime time={this.props.dateTime} />
                &nbsp;
                <LocalizedDate date={this.props.dateTime} />
            </span>
        );
    }
}