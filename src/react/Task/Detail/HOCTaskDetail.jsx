import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import TaskDetail from 'src/react/Task/Detail/TaskDetail';
import styles from 'src/react/Task/Detail/TaskDetail.styles';

@withWidth()
@withStyles(styles)
@withRouter
export default class HOCTaskDetail extends PureComponent {
  onCloseDrawer = () => {
    this.props.history.push('/tasks');
  }
  render() {
    const { task }  = this.props;

    if (!task) return null;
    // If on desktop
    if (isWidthUp('sm', this.props.width)) {
      return (
        <Grid item xs={12} sm={6} md={8} lg>
          <div className={this.props.classes.detailView}>
            <TaskDetail task={task} key={task.id} />
          </div>
        </Grid>
      )
    }

    return (
      <Drawer
        classes={{
          paper: this.props.classes.drawerPaper,
        }}
        anchor="right"
        open={true}
        onClose={this.onCloseDrawer}>
        <Grid container spacing={0} >
          <Grid item xs={12} style={{zIndex: 1500}}>
            <AppBar position={'static'}>
              <Toolbar>
                <IconButton color="inherit" className={this.props.classes.menuButton}>
                  <ArrowBack onClick={this.onCloseDrawer} />
                </IconButton>
                <Typography variant="title" color="inherit" className={this.props.classes.appBarTitle}>
                  {task.title}
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12} style={{ margin: 16 }}>
            <TaskDetail task={task} key={task.id} />
          </Grid>
        </Grid>
      </Drawer>
    )
  }
}
