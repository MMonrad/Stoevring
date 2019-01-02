import React, { PureComponent } from "react";
import moment from "moment-timezone";
import { withRouter } from "react-router-dom";
import { findDOMNode } from "react-dom";
import MenuList from "@material-ui/core/MenuList";
import { withStyles, withTheme } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import TaskListItem from "src/react/Task/List/Item/TaskListItem";
import * as taskRequests from "src/requests/taskRequests";
import * as directoryRequests from "src/requests/directoryRequests";
import requestRun from "src/utils/request/requestRun";

import taskSorterWithUsers from "src/utils/task/taskSorterWithUsers";
import taskFilter from "src/utils/task/taskFilter";
import fetchRequests from "src/react/_hocs/fetchRequests/fetchRequests";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";

import HOCTaskDetail from "src/react/Task/Detail/HOCTaskDetail";
import HOCTaskAdd from "src/react/Task/Add/HOCTaskAdd";

import styles from "src/react/Task/View/TaskView.styles";

import * as i18n from "i18next";

// Periodically check for list updates.
const REFRESH_TIMER = 1000 * 60 * 2; // 2 minutes

const values = object => Object.keys(object).map(key => object[key]);

const hasTaskInPath = path => /\/tasks\/([a-zA-Z0-9]+)/g.test(path);
const getSelectedId = path => {
    const id = path.replace(/\/tasks\/([a-zA-Z0-9]+)/g, (full, id) => id);
    return id.startsWith("/") ? undefined : id;
};

const getFirstUncheckedId = (tasks, users) => {
    const sortedTasks = taskSorterWithUsers(tasks, users);
    let newId;
    let newI;
    sortedTasks.forEach((t, i) => {
        if (!newId && (t.state === "Ready" && t.movedState === "NotMoved")) {
            newId = t.id;
            newI = i;
        }
    });
    if (!newId && sortedTasks.length) {
        newId = sortedTasks[sortedTasks.length - 1].id;
        newI = sortedTasks.length - 1;
    }
    return {
        i: newI,
        id: newId
    };
};

@withWidth()
@withTheme()
@withStyles(styles)
@withRouter
@fetchRequests(
    [
        props => ({
            tasks: taskRequests.listByOrganizationId(props.organizationId)
        }),
        props => ({
            users: directoryRequests.profilesBatch([
                ...new Set(values(props.tasks).map(t => t.citizenId))
            ])
        })
    ],   
    {
        renderLoader: () => (
            <div style={{ top: "25vh", left: "50vw", marginLeft: "-25px", position: "absolute" }}>
                <CircularProgress size={50} />
            </div>
        ),
        errorLabel: i18n.t("task:errors.fetch")
    }
)
export default class TaskView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            filterObj: {
                citizenIds: [],
                departmentIds: [],
                citizensIsActive: false,
                professionIds: [],
                categoryIds: []
            }
        };
        this.didScroll = false;
    }
    componentWillMount() {
        this.unlisten = this.props.history.listen(location => {
            this.setState({
                location
            });
        });
    }
    componentDidMount() {
        console.log(this.props);
        this.checkForRedirect();
        this.scrollToItem();
        // Skip a render cycle and check again in case we haven't scrolled yet (login)
        setTimeout(this.scrollToItem, 1);
        // Start refresh list timer.
        this.refreshTimer = setTimeout(this.onTimerFired, REFRESH_TIMER);
    }
    componentDidUpdate() {
        this.checkForRedirect();
    }
    componentWillUnmount() {
        this.unlisten();
        clearTimeout(this.refreshTimer);
    }
    onTimerFired = () => {
        requestRun(taskRequests.listByOrganizationId(this.props.organizationId));
        setTimeout(this.onTimerFired, REFRESH_TIMER);
    };
    onAdd = () => {
        this.setState({ openAddTask: true });
    };
    onCloseAdd = () => {
        this.setState({ openAddTask: false });
    };
    scrollToItem = () => {
        if (this.didScroll || !this.measureItem) return;

        const scrollViewEl = findDOMNode(this.scrollView);
        if (scrollViewEl) {
            const measureItemEl = findDOMNode(this.measureItem);
            if (!measureItemEl || !measureItemEl.clientHeight) return;
            const { tasks, users } = this.props;
            const { i } = getFirstUncheckedId(tasks, users);
            if (typeof i === "number") {
                scrollViewEl.scrollTop = i * measureItemEl.clientHeight;
            }
            this.didScroll = true;
        }
    };
    checkForRedirect() {
        const { location, width, tasks, history, users } = this.props;

        const selectedId = getSelectedId(location.pathname);
        // If we have an id in route that does not exist in tasks.
        if (selectedId && !tasks[selectedId]) {
            history.replace("/tasks");
        }
        // If on desktop . Ensure open one.
        else if (isWidthUp("sm", width) && !selectedId) {
            const { id } = getFirstUncheckedId(tasks, users);
            history.replace(`/tasks/${id}`);
        }
    }

    render() {
        const { classes, tasks, users, location, theme } = this.props;
        const selectedId = getSelectedId(location.pathname);
        const sortedTasks = taskSorterWithUsers(tasks, users);
        const filteredTasks = taskFilter(sortedTasks, users, this.state.filterObj);
        return (
            <div className={classes.root}>
                <Grid container spacing={0} className={classes.grid}>
                    <Grid
                        ref={c => (this.scrollView = c)}
                        item
                        className={classes.gridItem}
                        xs={12}
                        sm={6}
                        md={4}>
                        <MenuList className={classes.taskMenu}>
                            {filteredTasks.map((task, i) => (
                                <TaskListItem
                                    measureHeightRef={
                                        i === 0
                                            ? c => {
                                                  this.measureItem = c;
                                                  this.scrollToItem();
                                              }
                                            : undefined
                                    }
                                    selected={task.id === selectedId}
                                    task={task}
                                    key={i}
                                />
                            ))}
                        </MenuList>
                    </Grid>
                    <Button
                        onClick={this.onAdd}
                        variant="fab"
                        color="secondary"
                        aria-label="Add"
                        className={classes.fabButton}>
                        <AddIcon />
                    </Button>
                    <HOCTaskDetail task={tasks[getSelectedId(location.pathname)]} />
                </Grid>
                <Button
                    onClick={this.onAdd}
                    variant="fab"
                    color="primary"
                    aria-label="Add"
                    className={classes.addButton}>
                    <AddIcon />
                </Button>
                <HOCTaskAdd open={this.state.openAddTask} onBack={this.onCloseAdd} />
            </div>
        );
    }
}
