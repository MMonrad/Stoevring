import * as React from "react";
import { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { withOptimist } from "react-optimist";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import DirectoryName from "src/react/Directory/Name/DirectoryName";
import { timeHelper } from "src/utils/time/TimeHelper";
import taskUpdateChecker from "src/utils/task/taskUpdateChecker";

import requestRun from "src/utils/request/requestRun";
import * as taskRequests from "src/requests/taskRequests";

import { withStyles, withTheme } from "@material-ui/core/styles";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import NotInterested from "@material-ui/icons/NotInterested";
import LocalizedTime from "src/react/Time/Time/LocalizedTime";
import LowPriority from "@material-ui/icons/LowPriority";
import moment from "moment-timezone";
import orange from '@material-ui/core/colors/orange'
import green from '@material-ui/core/colors/green'
import TaskLastUpdated from 'src/react/Task/LastUpdated/TaskLastUpdated'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { translate } from 'react-i18next';
import DirectoryPictureAvatar from 'src/react/Directory/Picture/Avatar/DirectoryPictureAvatar';

const styles = theme => ({
    sizeIcon: {
        fontSize: "2.1rem",
        width: theme.spacing.unit * 6
    },
    icon: {
        fontSize: "2rem",
        width: theme.spacing.unit * 6
    },
    item: {
        flex: "inherit",
        fontSize: "0.9rem"
    },
    itemOverdue: {
        color: orange[900]
    },
    menuItem: {
        paddingTop: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 4
    },
    avatar: {
        width: theme.spacing.unit * 6,
        height: theme.spacing.unit * 6
    }
});

@withOptimist
@withWidth()
@withTheme()
@withStyles(styles)
@withRouter
@translate("task")
export default class TaskListItem extends PureComponent {
    constructor(props) {
        super(props);
        props.optimist.identify(props.task.id);
    }
    onChange = () => {
        if (this.isCheckingOff) return;
        this.isCheckingOff = true;
        const { task, optimist, t } = this.props;
        let overrideComplete = true;
        let request = taskRequests.completeById;
        setTimeout(() => {
            this.selectTask(true);
        }, 5);
        if (this.isTaskCompleted()) {
            overrideComplete = false;
            request = taskRequests.clearById;
        }

        optimist.set("state", overrideComplete ? "Completed" : "Ready");

        requestRun(request(task.citizenId, task.id), (response, showErrorUI) => {
            optimist.unset("state");
            this.isCheckingOff = false;
            return showErrorUI(t("task:errors:updating"));
        }).then(res => {
            taskUpdateChecker.checkUpdatesForTask(task, optimist);
            this.isCheckingOff = false;
            console.log("success in task", res);
        });
    };

    renderCheckbox() {
        const { optimist, task, classes, theme } = this.props;

        if (optimist.get("movedState", task.movedState) === "MovedAway") {
            return (
                <LowPriority
                    style={{ color: theme.palette.action.active }}
                    className={classes.icon}
                />
            );
        }
        if (optimist.get("state", task.state) === "Cancelled") {
            return (
                <NotInterested
                    style={{ color: theme.palette.action.active }}
                    className={classes.icon}
                />
            );
        }
        return (
            <Checkbox
                icon={<CheckBoxOutlineBlankIcon className={classes.sizeIcon} />}
                checkedIcon={<CheckBoxIcon className={classes.sizeIcon} />}
                checked={this.isTaskCompleted()}
                onChange={this.onChange}
                tabIndex={-1}
                disableRipple={true}
                color="secondary"
            />
        );
    }

    isTaskCompleted() {
        const { task, optimist } = this.props;
        return optimist.get("state", task.state) === "Completed";
    }

    isTaskOverdue() {
        const { task, optimist } = this.props;
        if (
            optimist.get("state", task.state) === "Ready" &&
            (optimist.get("movedState", task.movedState) === "NotMoved" ||
                optimist.get("movedState", task.movedState) === "MovedHere")
        ) {
            if (
                moment(task.plannedExecutionSlot.before)
                    .local()
                    .diff(moment(), "minutes") < 0
            )
                return true;
        }
        return false;
    }

    getClasses() {}

    selectTask(mobileActive) {
        const { task, selected, history, width } = this.props;
        if (mobileActive && !isWidthUp("sm", width)) return;

        if (!selected) {
            history.push(`/tasks/${task.id}`);
        }
    }

    render() {
        const { classes, task, selected, measureHeightRef, theme } = this.props;

        var on_selected = {
            backgroundColor: "rgba(0, 0, 0, 0.14)",
            transition: "background-color 0s ease-in",
            transitionDelay: "300"
        };
        var on_unselected = {
            backgroundColor: "white",
            transition: "background-color .5s ease-out"
        };

        return (
            <React.Fragment>
                <MenuItem
                    ref={measureHeightRef}
                    button
                    selected={!!selected}
                    key={task.id}
                    role={undefined}
                    dense={true}
                    className={classes.menuItem}
                    style={selected ? on_selected : on_unselected}>
                    <ListItemIcon style={{ width: theme.spacing.unit * 7 }}>
                        <div>
                            <DirectoryPictureAvatar userId={task.citizenId}/>
                        </div>
                    </ListItemIcon>
                    <ListItemText
                        onClick={() => this.selectTask(false)}
                        className={classes.item}
                        style={{ paddingLeft: 0, flex: 1 }}
                        classes={
                            this.isTaskOverdue()
                                ? {
                                      primary: classes.itemOverdue,
                                      secondary: classes.itemOverdue
                                  }
                                : null
                        }
                        primary={
                            <React.Fragment>
                                <div
                                    style={{
                                        fontSize: "1.1rem",
                                        textOverflow: "ellipsis",
                                        paddingRight: theme.spacing.unit * 3,
                                        overflow: "hidden"
                                    }}>
                                    {task.title}
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: theme.spacing.unit / 2,
                                        right: theme.spacing.unit
                                    }}>
                                    <TaskLastUpdated task={task} />
                                </div>
                                <div style={{ color: theme.palette.text.secondary }}>
                                    <LocalizedTime
                                        time={timeHelper.parseZonedDateTime(
                                            task.plannedExecutionSlot.after,
                                            task.plannedExecutionSlot.timeZone
                                        )}
                                    />
                                    &nbsp;-&nbsp;
                                    <LocalizedTime
                                        time={timeHelper.parseZonedDateTime(
                                            task.plannedExecutionSlot.before,
                                            task.plannedExecutionSlot.timeZone
                                        )}
                                    />
                                    <br />
                                    <DirectoryName userId={task.citizenId} />
                                </div>
                            </React.Fragment>
                        }
                    />
                    <ListItemSecondaryAction>{this.renderCheckbox()}</ListItemSecondaryAction>
                </MenuItem>
                <Divider />
            </React.Fragment>
        );
    }
}
