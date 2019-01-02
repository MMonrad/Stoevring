import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withOptimist } from "react-optimist";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import * as taskRequests from "src/requests/taskRequests";
import requestRun from "src/utils/request/requestRun";
import taskUpdateChecker from "src/utils/task/taskUpdateChecker";

import { translate } from "react-i18next";

@withOptimist
@withWidth()
@withRouter
@translate("task")
export default class TaskActionCancelCancellation extends PureComponent {
    constructor(props) {
        super(props);
        props.optimist.identify(props.task.id);
    }

    onClear = () => {
        const { task, optimist, history, width } = this.props;
        optimist.set("state", "Ready");
        requestRun(taskRequests.clearById(task.citizenId, task.id), (response, showErrorUI) => {
            optimist.unset("state");
            return showErrorUI("Could not uncomplete task. Something went wrong");
        }).then(() => {
            taskUpdateChecker.checkUpdatesForTask(task, optimist);
        });
        if (isWidthDown("xs", width)) {
            history.push("/tasks");
        }
    };

    render() {
        const { buttonClass, task, optimist, t } = this.props;
        if (optimist.get("state", task.state) !== "Cancelled") return null;
        return (
            <Button
                variant="outlined"
                color="secondary"
                className={buttonClass}
                onClick={this.onClear}>
                {t("cancelCancellation")}
            </Button>
        );
    }
}
