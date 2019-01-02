import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { authentication } from 'src/utils/authentication/authentication';

const styles = (theme) => ({
    root: {
        flexGrow: 1
    },
    drawer: {
        width: 250,
    },
    menuButton: {
        marginLeft: -(theme.spacing.unit),
      },
});

@withStyles(styles)
export default class TopAppBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userMenu: false
        }
    }

    toggleUserMenu = (e) => {
        e.preventDefault()
        this.setState({
            userMenu: !this.state.userMenu,
        });
    };

    render() {
    const { classes } = this.props;

    return (
        <div className={classes.root}>
        <AppBar position="fixed">
            <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" style={{ fontSize: 30 }}>
                <AccountCircle onClick={this.toggleUserMenu} style={{fontSize: 40}}/>
            </IconButton>
            <Drawer open={this.state.userMenu} onClose={this.toggleUserMenu}>
                    <div className={classes.drawer}>
                        <Divider/>
                        <List component="nav">
                            <ListItem button onClick={()=> authentication.Instance.logout()}>
                            <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
          </Toolbar>
        </AppBar>
        </div>
    );
    }

}