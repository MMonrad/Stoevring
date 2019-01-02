import React, { PureComponent, Fragment, createRef } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Textfield from "@material-ui/core/TextField";
import { withOptimist } from "react-optimist";
import * as taskRequests from "src/requests/taskRequests";
import requestRun from "src/utils/request/requestRun";
import { timeHelper } from "src/utils/time/TimeHelper";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment-timezone";
import { translate } from "react-i18next";
import taskUpdateChecker from "src/utils/task/taskUpdateChecker";
import { isChosenDateSameOrAfterStartDate } from "src/utils/time/TimeValidation";
import { withStyles, withTheme } from "@material-ui/core/styles";

@withMobileDialog()
@withOptimist
@withTheme()
@translate(["task", "global"])
export default class TaskActionMove extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            chosenDate: moment(this.props.task.plannedExecutionSlot.after)
                .add(1, "days")
                .format("YYYY-MM-DD"),
            reason: "",
            defaultDate: moment(this.props.task.plannedExecutionSlot.after)
                .add(1, "days")
                .format("YYYY-MM-DD")
        };
        props.optimist.identify(props.task.id);
        this.dateRef = createRef();
        this.textRef = createRef();
    }

    render() {
        const { buttonClass, fullScreen, optimist, task, t, theme } = this.props;
        if (
            optimist.get("state", task.state) !== "Ready" ||
            optimist.get("movedState", task.movedState) !== "NotMoved"
        ) {
            return null;
        }
        return (
            <Fragment>
                <Button
                    variant="outlined"
                    color="secondary"
                    className={buttonClass}
                    onClick={this.onMoveButtonClicked}>
                    {t("task:move")}
                </Button>
                <Dialog fullScreen={fullScreen} open={this.state.open} disableBackdropClick>
                    <DialogTitle>{t("Move task")}</DialogTitle>
                    <DialogContent>
                        <FormControl component="div">
                            <Textfield
                                id="date"
                                type="date"
                                label={t("Select date")}
                                defaultValue={this.state.defaultDate}
                                inputRef={this.dateRef}
                                onInput={this.onSelectedDateChanged}
                                fullWidth
                                margin="normal"
                            />
                        </FormControl>
                        <Textfield
                            id="reason"
                            label={t("State reason for moving task.")}
                            rowsMax={4}
                            multiline
                            inputRef={this.textRef}
                            onInput={this.onReasonInput}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions style={{ padding: theme.spacing.unit / 2 }}>
                        <Button color="secondary" variant="outlined" onClick={this.onClose}>
                            {t("global:close")}
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={this.onConfirmButtonClicked}
                            disabled={this.state.reason === null || this.state.reason.length <= 0}>
                            {t("move")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }

    getDateInCorrectFormat = () => {
        const { task } = this.props;
        const movedTo = this.state.chosenDate + task.plannedExecutionSlot.after.slice(10);
        const movedToDateTime = timeHelper.parseZonedDateTime(
            movedTo,
            task.plannedExecutionSlot.timeZone
        );
        const movedToSerialized = timeHelper.serializeZonedDateTime(movedToDateTime);
        return movedToSerialized;
    };

    onConfirmButtonClicked = () => {
        const { task, optimist } = this.props;
        const movedToSerialized = this.getDateInCorrectFormat();
        optimist.set("movedState", "MovedAway");

        requestRun(
            taskRequests.moveById(task.citizenId, task.id, this.state.reason, movedToSerialized),
            (response, showErrorUI) => {
                optimist.unset("movedState");
                return showErrorUI("Could not move task. Something went wrong.");
            }
        ).then(() => {
            taskUpdateChecker.checkUpdatesForTask(task, optimist);
        });
        this.onClose();
    };

    onReasonInput = () => {
        this.setState({
            reason: this.textRef.current.value
        });
    };

    onSelectedDateChanged = () => {
        if (
            isChosenDateSameOrAfterStartDate(
                this.state.defaultDate,
                this.dateRef.current.value,
                this.props.task.plannedExecutionSlot.timeZone
            )
        ) {
            this.setState(
                {
                    chosenDate: this.dateRef.current.value
                },
                () => {
                    this.textRef.current.focus();
                }
            );
        } else {
            this.dateRef.current.value = this.state.defaultDate;
            this.setState({
                chosenDate: this.state.defaultDate
            });
        }
    };

    onMoveButtonClicked = () => {
        this.setState({
            open: true
        });
    };

    onClose = () => {
        this.setState({
            open: false,
            chosenDate: moment(this.props.task.plannedExecutionSlot.after)
                .add(1, "days")
                .format("YYYY-MM-DD"),
            reason: ""
        });
    };
}
