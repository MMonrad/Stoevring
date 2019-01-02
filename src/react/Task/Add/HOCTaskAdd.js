import React, { PureComponent } from 'react'

import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { translate } from 'react-i18next'

import styles from 'src/react/Task/Add/TaskAdd.styles';
import TaskAdd from 'src/react/Task/Add/TaskAdd';

const Transition = props => <Slide direction="up" {...props} />;

@withStyles(styles)
@translate(["task"])
@withMobileDialog()
export default class HOCTaskAdd extends PureComponent {
    render() {
        const { open, onBack, classes, fullScreen, t } = this.props;
        return (
            <Dialog
                fullScreen={fullScreen}
                open={!!open}
                TransitionComponent={Transition}>
                <AppBar position={'static'}>
                    <Toolbar>
                        <IconButton  onClick={onBack} color="inherit" className={classes.menuButton}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {t("task:addTask:addTask")}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <TaskAdd onBack={onBack}/>
            </Dialog>
        )
    }
}