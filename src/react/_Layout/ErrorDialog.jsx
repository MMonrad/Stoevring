import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as errorActions from "src/redux/error/errorActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { translate } from "react-i18next";
import withMobileDialog from "@material-ui/core/withMobileDialog";

@connect(
    state => ({
        error: state.error
    }),
    {
        errorClear: errorActions.clear
    }
)
@translate(["global"])
@withMobileDialog()
export default class ErrorDialog extends PureComponent {
    constructor(props) {
        super(props);
        this.setPrev();
    }
    componentWillReceiveProps(nextProps) {
        const { error } = this.props;
        if (error.get("message") && !nextProps.error.get("message")) {
            this.setPrev(error.get("message"), error.get("retryHandlers"));
        } else if (!error.get("message") && nextProps.error.get("message")) {
            this.setPrev();
        }
    }
    setPrev(message = "", handlers = []) {
        this.prevMessage = message;
        this.prevHandlers = handlers;
    }
    onClose = () => {
        const { errorClear } = this.props;
        errorClear();
    };
    onRetry = () => {
        const { error, errorClear } = this.props;

        error.get("retryHandlers").forEach(handler => handler());
        errorClear();
    };
    render() {
        const { error, t, fullScreen } = this.props;
        const message = error.get("message");
        const retryHandlers = error.get("retryHandlers");

        return (
            <Dialog
                open={!!message}
                fullScreen={fullScreen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{t("errorDialogTitle")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message || this.prevMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {(!!retryHandlers.size || !!this.prevHandlers.size) && (
                        <Button variant="outlined" color="secondary" onClick={this.onRetry}>
                            {t("tryAgain")}
                        </Button>
                    )}
                    {!retryHandlers.size &&
                        !this.prevHandlers.size && (
                            <Button variant="outlined" color="secondary" onClick={this.onClose}>
                                {t("close")}
                            </Button>
                        )}
                </DialogActions>
            </Dialog>
        );
    }
}
