import React, { PureComponent, Fragment, createRef } from "react";
import { withTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as taskRequests from "src/requests/taskRequests";
import requestRun from "src/utils/request/requestRun";
import { withOptimist } from "react-optimist";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { translate } from "react-i18next";
import taskUpdateChecker from "src/utils/task/taskUpdateChecker";

const defaultState = {
    open: false,
    reason: null,
    showTextField: false,
    radioLabel: null
};

@withOptimist
@withMobileDialog()
@withTheme()
@translate(["task", "global"])
export default class TaskActionCancellation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { ...defaultState };
        props.optimist.identify(props.task.id);
        this.textRef = createRef();
    }

    render() {
        const { optimist, buttonClass, task, fullScreen, t, theme } = this.props;

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
                    onClick={this.handleClickOpen}
                    className={buttonClass}>
                    {t("task:cancel")}
                </Button>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClickClose}
                    disableBackdropClick
                    aria-labelledby="cancel-dialog-title"
                    aria-describedby="cancel-dialog-text"
                    maxwidth="sm"
                    fullWidth
                    id="cancelDialog">
                    <DialogTitle id="cancel-dialog-title">{t("task:cancelHeadline")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t("task:cancellation:reason")}</DialogContentText>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Reason"
                                name="reasonRadioGroup"
                                value={this.state.radioLabel}>
                                <FormControlLabel
                                    value="Citizen not at home"
                                    label={t("task:cancellation:citizenNotHome")}
                                    control={<Radio onClick={this.onRadioButtonChecked} />}
                                />
                                <FormControlLabel
                                    value="Citizen cancelled"
                                    label={t("task:cancellation:citizenCancelled")}
                                    control={<Radio onClick={this.onRadioButtonChecked} />}
                                />
                                <FormControlLabel
                                    value=""
                                    label={t("task:cancellation:otherReason")}
                                    control={
                                        <Radio onClick={this.onOtherReasonRadioButtonChecked} />
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                        {this.state.showTextField === true && (
                            <TextField
                                placeholder="State other reason"
                                inputRef={this.textRef}
                                fullWidth
                                onInput={this.onReasonTextInput}
                                multiline
                                rows="4"
                            />
                        )}
                    </DialogContent>
                    <DialogActions style={{ padding: theme.spacing.unit / 2 }}>
                        <Button
                            onClick={this.handleClickClose}
                            color="secondary"
                            variant="outlined">
                            {t("global:close")}
                        </Button>
                        <Button
                            onClick={this.handleClickOk}
                            color="secondary"
                            variant="contained"
                            disabled={this.state.reason === null || this.state.reason.length <= 0}>
                            {t("task:cancel")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }

    onRadioButtonChecked = e => {
        this.setState({
            reason: e.target.value,
            showTextField: false,
            radioLabel: e.target.value
        });
    };

    focusTextInput = () => {
        this.textRef.current.focus();
    };

    onOtherReasonRadioButtonChecked = e => {
        this.setState(
            {
                reason: e.target.value,
                showTextField: true,
                radioLabel: ""
            },
            () => {
                this.textRef.current.focus();
            }
        );
    };

    onReasonTextInput = e => {
        this.setState({
            reason: e.target.value
        });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClickClose = () => {
        this.setState(defaultState);
    };

    handleClickOk = () => {
        const { task, optimist, t } = this.props;
        optimist.set("state", "Cancelled");
        requestRun(
            taskRequests.cancelById(task.citizenId, task.id, this.state.reason),
            (response, showErrorUI) => {
                optimist.unset("state");
                return showErrorUI(t("task:errors:cancel"));
            }
        ).then(() => {
            taskUpdateChecker.checkUpdatesForTask(task, optimist);
        });
        this.handleClickClose();
    };
}
