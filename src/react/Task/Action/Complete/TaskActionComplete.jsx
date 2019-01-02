import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { withOptimist } from "react-optimist";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import * as taskRequests from "src/requests/taskRequests";
import requestRun from "src/utils/request/requestRun";
import { translate } from "react-i18next";
import taskUpdateChecker from "src/utils/task/taskUpdateChecker";

@withOptimist
@withWidth()
@withRouter
@translate(["task"])
export default class TaskActionComplete extends PureComponent {
    constructor(props) {
        super(props);
        props.optimist.identify(props.task.id);
    }

    onComplete = async (e, checked) => {
        const { task, optimist, history, width, t } = this.props;
        optimist.set("state", "Completed");

        requestRun(taskRequests.completeById(task.citizenId, task.id), (response, showErrorUI) => {
            optimist.unset("state");
            return showErrorUI(t("task:errors:complete"));
        }).then(() => {
            taskUpdateChecker.checkUpdatesForTask(task, optimist);
        });

        if (isWidthDown("xs", width)) {
            history.push("/tasks");
        }
    };

    render() {
        const { className, task, optimist, t } = this.props;
        if (
            optimist.get("state", task.state) === "Ready" &&
            optimist.get("movedState", task.movedState) !== "MovedAway"
        )
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className={className}
                    onClick={this.onComplete}>
                    {t("task:complete")}
                </Button>
            );
        return null;
    }
}
