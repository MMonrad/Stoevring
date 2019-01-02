import React, { PureComponent } from "react";
import TopAppBar from "src/react/_Layout/TopAppBar"
import { Route, Switch, withRouter } from 'react-router-dom';
import TaskView from "src/react/Task/View/TaskView"
import { AppInsights } from "applicationinsights-js"
import CircularProgress from '@material-ui/core/CircularProgress';
import { authentication } from "src/utils/authentication/authentication";
import { withStyles } from '@material-ui/core/styles';
import ErrorDialog from 'src/react/_Layout/ErrorDialog';
import IdleDialog from 'src/react/_Layout/IdleDialog';
import 'src/i18n';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },

});

@withRouter
@withStyles(styles)
export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      hasCheckedAuth: false,
    }
  }

  componentDidMount() {

    authentication.Instance.isAuthenticated().then(isAuth => {

      if (window.location.hash.indexOf("access_token") !== -1) {
        authentication.Instance.authenticate();
        return;
      }

      if (!isAuth) {
        authentication.Instance.login();
        return;
      }

      this.setState({
        hasCheckedAuth: true,
      });
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasCheckedAuth !== this.state.hasCheckedAuth) {
      const { location, history } = this.props;
      if (!location.pathname.startsWith('/tasks')) {
        history.replace('/tasks');
      }
    }
  }

  componentDidCatch(error) {
    AppInsights.trackException(error);
  }
  renderLoader() {
    return (
        <div style={{ top: '25vh', left: '50vw', marginLeft: '-25px', position: 'fixed' }}>
            <CircularProgress size={50} />
        </div>
    )
  }
  render() {
    const { classes } = this.props;
    if (!this.state.hasCheckedAuth) {
      return this.renderLoader();
    }
    return (
      <div className={classes.root}>
        <TopAppBar />
        <Switch>
          <Route path="/tasks*" component={TaskView} />
          <Route path="*" render={this.renderLoader} />
        </Switch>
        <IdleDialog />
        <ErrorDialog />
      </div>
    )
  }
}