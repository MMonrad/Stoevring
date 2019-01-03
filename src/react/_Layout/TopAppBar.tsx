import { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';

const styles = (theme: Theme) => ({
    root: {
        flexGrow: 1
    },
});

interface ITopAppBarProps {
    classes: {
      root: any;
    }
  }

class TopAppBar extends Component<ITopAppBarProps> {
    constructor(props: ITopAppBarProps) {
        super(props)
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(TopAppBar)