import React, { PureComponent } from "react";
import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';
import * as planRequests from 'src/requests/planRequests';
import { withStyles, withTheme } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { withOptimist } from "react-optimist";
import DirectoryName from "src/react/Directory/Name/DirectoryName";
import DirectoryPictureCard from "src/react/Directory/Picture/Card/DirectoryPictureCard";
import CategoryName from 'src/react/Category/Name/CategoryName'
import ProfessionName from "src/react/Profession/Name/ProfessionName";
import TaskLastUpdated from "src/react/Task/LastUpdated/TaskLastUpdated";
import TaskActionCancelCancellation from "src/react/Task/Action/CancelCancellation/TaskActionCancelCancellation";
import TaskActionCancellation from "src/react/Task/Action/Cancellation/TaskActionCancellation";
import TaskActionComplete from "src/react/Task/Action/Complete/TaskActionComplete";
import TaskActionUncomplete from "src/react/Task/Action/Uncomplete/TaskActionUncomplete";
import LocalizedDateTime from "src/react/Time/DateTime/LocalizedDateTime";
import moment from "moment-timezone";
import TaskActionMove from "src/react/Task/Action/Move/TaskActionMove";
import { translate } from "react-i18next";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';

import styles from "src/react/Task/Detail/TaskDetail.styles";

@withOptimist
@withWidth()
@withTheme()
@withStyles(styles)
@fetchRequests([
    props => ({
        plans: planRequests.plans(props.task.citizenId)
    })
])
@translate(["task"])
export default class TaskDetail extends PureComponent {
    constructor(props) {
        super(props);
        props.optimist.identify(props.task.id);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    renderMeta() {
        const { task, classes, theme, t } = this.props;
        let types = [];
        const re = /, $/;
        if (task.requiresTwoWorkers) types.push(t("types.requiresTwoWorkers"));
        if (task.isMedicationRelated) types.push(t("types.medicationRelated"));
        if (task.isContactPersonRelated) types.push(t("types.contactPersonRelated"));
        if (task.categoryIds.indexOf("HealthAct") !== -1) types.push(t("types.healthAct"));

        if (types !== "") {
            return (
                <Card className={classes.cardSecondary}>
                    <CardContent style={{paddingBottom: theme.spacing.unit}}>
                        <Typography gutterBottom variant="display1">{t("about")}</Typography>
                        <Typography variant="display2">
                                <ProfessionName professionId={task.professionId} />
                            </Typography>
                        {types.map((type, i) => (
                            <Typography variant="display2" key={i}>{type}</Typography>
                        ))}
                    </CardContent>
                </Card>
            );
        }
    }

    renderHistory() {
        const { task, classes, theme,  t, optimist } = this.props;

        if (!task.lastChangedEvent) return null;

        let state = optimist.get("state", task.state);
        if (optimist.get("movedState", task.movedState) === "MovedAway") {
            state = "MovedAway";
        }
        if (state === "Ready") {
            return null;
        }
        return (
            <Card className={classes.cardSecondary}>
                    <CardContent style={{paddingBottom: theme.spacing.unit}}>
                        <Typography gutterBottom variant="display1">{t("state." + state)}</Typography>
                        <Typography variant="display2"><LocalizedDateTime dateTime={moment(task.lastChangedEvent.timestamp)} /></Typography>
                        <Typography variant="display2"><DirectoryName userId={task.lastChangedEvent.employeeId} /></Typography>
                        
                    </CardContent>
            </Card>
        );
    }

    renderPlans() {
        const { plans, classes, theme, task } = this.props;
        if(!plans) return null;
        const filteredPlans = (object => Object.keys(object).map(key => object[key]))(plans)
            .filter(plan => !plan.ended)
            .filter(plan => task.associatedWithIds.findIndex(c => c === plan.id) > -1);
            console.log(filteredPlans)
                return (
                    <React.Fragment>
                        {filteredPlans && filteredPlans.map((plan, i) => (
                            <Card className={classes.cardSecondary} key={i}>
                            <CardHeader
                                avatar={
                                    <Avatar style={{backgroundColor: theme.palette.secondary.light}}>
                                    I
                                    </Avatar>
                                }
                                title={<CategoryName key={plan.id} categoryId={plan.categoryId}/>}
                                subheader="her kommer path"
                            />
                            <CardContent>
                                <Typography component="p">
                                    {plan.description}
                                </Typography>
                            </CardContent>
                        </Card>
                        ))}
                    </React.Fragment>
                    
                );
    }


    getScrollHeight() {
        const { width } = this.props;
        let bars = 56;
        if (isWidthUp("sm", width)) bars = 64;
        return this.state.height - bars * 2;
    }

    render() {
        const { task, classes, theme, t, plans } = this.props;
        return (
            <Grid className={classes.root} container spacing={theme.spacing.unit * 4}>
                <Grid
                    item
                    xs={12}
                    className={classes.detailScrollContainer}
                    style={{ maxWidth: 854, height: this.getScrollHeight() }}>
                    <Grid container spacing={theme.spacing.unit * 4}>
                        <Grid item xs={12} md={7} lg={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="headline" gutterBottom component="h2">
                                        {t("description")}
                                        <TaskLastUpdated task={task} />
                                    </Typography>
                                    <Typography component="p">{task.description}</Typography>
                                </CardContent>
                            </Card>
                            {this.renderPlans()}
                        </Grid>
                        <Grid item xs={12} md={5} lg={4}>
                            <Card>
                                <DirectoryPictureCard userId={task.citizenId} />
                                <CardContent>
                                    <Typography variant="subheading">
                                        <DirectoryName userId={task.citizenId} />
                                    </Typography>
                                </CardContent>
                            </Card>

                            {this.renderMeta()}
                            
                            {this.renderHistory()}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    style={{ padding: 0, boxShadow: "0px -2px 10px -1px rgba(0, 0, 0, 0.14)" }}
                    xs={12}>
                    <AppBar position="static" color="default">
                        <Toolbar
                            style={{
                                justifyContent: "flex-end",
                                paddingRight: theme.spacing.unit / 2,
                                paddingBottom: 1
                            }}
                            disableGutters>
                            <TaskActionUncomplete className={classes.button} task={task} />
                            <TaskActionMove buttonClass={classes.button} task={task} />
                            <TaskActionCancellation task={task} buttonClass={classes.button} />
                            <TaskActionCancelCancellation
                                task={task}
                                buttonClass={classes.button}
                            />
                            <TaskActionComplete className={classes.button} task={task} />
                        </Toolbar>
                    </AppBar>
                </Grid>
            </Grid>
        );
    }
}
