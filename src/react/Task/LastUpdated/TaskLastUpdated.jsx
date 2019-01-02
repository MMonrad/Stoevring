import React, { PureComponent } from 'react';
import moment from "moment-timezone";
import { withStyles } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
    circle: {
        width: 10,
        height: 10,
        background: blue[700],
        borderRadius: 5,
        display: 'inline-block',
        marginLeft: theme.spacing.unit,
        marginBottom: 1,
    },
});

@withStyles(styles)
export default class TaskLastUpdated extends PureComponent {
    render() {
        const { classes, task } = this.props;
        if (task.lastUpdatedAtTimestamp) {
            const lastUpdatedAtTimestamp = moment(task.lastUpdatedAtTimestamp)
            if (lastUpdatedAtTimestamp.local().diff(moment(), 'days') > -14) {
                return (
                    <div className={classes.circle}></div>
                )
            }
        }
        return null
    }
    
  }
