import React, { PureComponent, Fragment, createRef} from 'react'
import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';
import requestRun from 'src/utils/request/requestRun';
import * as directoryRequests from 'src/requests/directoryRequests';
import * as taskRequests from 'src/requests/taskRequests';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import styles from 'src/react/Task/Add/TaskAdd.styles';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import TaskAddAutoSuggestion from 'src/react/Task/Add/AutoSuggestion/TaskAddAutoSuggestion';
import moment from 'moment-timezone';
import { timeHelper } from 'src/utils/time/TimeHelper';
import {isChosenDateSameOrAfterStartDate} from 'src/utils/time/TimeValidation';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'
import { translate } from 'react-i18next'

@withStyles(styles)
@translate(["task"])
@fetchRequests({
    citizens: directoryRequests.citizensFromNode(),
    standardTasks: taskRequests.standardTasksForAdHoc(),
})
export default class TaskAdd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            citizenId: '',
            chosenTask: {
                title: '',
            },
            date: moment().format('YYYY-MM-DD'),
            startTime: moment().format('HH:mm'),
            endTime: moment().add(1, 'hours').format('HH:mm'),
            taskDescription: '',
            isTwoPersonTask: false,
        }
        this.textRef = createRef();
        this.dateRef= createRef();
        this.startTimeRef = createRef();
        this.endTimeRef = createRef();
        this.checkBoxRef = createRef();
    }

    onCitizenSelectedCallback = (citizen) => {
        this.setState({
            citizenId: citizen.id,
        });
    }

    onDescriptionInput = () => {
        this.setState({
            taskDescription: this.textRef.current.value,
        });
    }

    onDateChanged = () => {
        console.log(this.state.date, this.dateRef.current.value);
        if(isChosenDateSameOrAfterStartDate(this.state.date, this.dateRef.current.value, moment.tz.guess())) {
            this.setState({
                date: this.dateRef.current.value,
            });
        } else {
            this.dateRef.current.value = this.state.date;
        }
    }

    onStartTimeChanged = () => {
        this.setState({
            startTime: this.startTimeRef.current.value,
        });
    }

    onEndTimeChanged = () => {
        this.setState({
            endTime: this.endTimeRef.current.value,
        });
    }

    onSelectedTaskChanged = (e) => {
        this.setState({
            chosenTask: e.target.value,
        }, () => {
            this.textRef.current.value = this.state.chosenTask.description;
            this.setState({
                taskDescription: this.state.chosenTask.description,
                isTwoPersonTask: this.state.chosenTask.requiresTwoWorkers,
            });
        });
    }

    onCheckboxChecked = () => {
        console.log('checked', this.checkBoxRef.current.checked);
        this.setState({
            isTwoPersonTask: this.checkBoxRef.current.checked,
        });
    }

    onConfirmClick = () => {
        const {citizenId, chosenTask, taskDescription, date, startTime, endTime, isTwoPersonTask} = this.state;
        const {errorAdd, onBack} = this.props;
        const startTimeAsMoment = timeHelper.parseZonedDateTime(`${date} ${startTime}`, moment.tz.guess());
        const endTimeAsMoment = timeHelper.parseZonedDateTime(`${date} ${endTime}`, moment.tz.guess());

        requestRun(taskRequests.createAdhocAssignment(citizenId, chosenTask.id, taskDescription, {
            after: timeHelper.serializeZonedDateTime(startTimeAsMoment).dateTime,
            before: timeHelper.serializeZonedDateTime(endTimeAsMoment).dateTime,
            timezone: startTimeAsMoment.tz(),
        }, isTwoPersonTask));
        onBack();
    }

    render() {
        const { citizens, standardTasks, classes, onBack, t } = this.props;
        const {date, startTime, endTime, citizenId, chosenTask, taskDescription, isTwoPersonTask} = this.state;
        console.log(standardTasks);

        return (
            <Fragment>
                <DialogContent>
                    <DialogContent>
                        <TaskAddAutoSuggestion citizenData={citizens} onCitizenSelectedCallback={this.onCitizenSelectedCallback}/>
                    </DialogContent>
                    <DialogContent>
                        <Select
                        value={chosenTask.title}
                        fullWidth
                        onChange={this.onSelectedTaskChanged}
                        renderValue={(value) => (<div>{value}</div>)}
                        disabled={citizenId.length <= 0}
                        >
                            <MenuItem disabled>
                                {t("task:addTask:chooseTask")}
                            </MenuItem>
                            {Object.keys(standardTasks).map((task, i) => (
                                <MenuItem value={standardTasks[task]} key={i}>
                                    {standardTasks[task].title}
                                </MenuItem>                            
                            ))}
                        </Select>
                    </DialogContent>
                    <DialogContent>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <TextField type='date' 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>{t("task:addTask:date")}</InputAdornment>
                                    )
                                }}
                                defaultValue={date}
                                inputRef={this.dateRef}
                                onChange={this.onDateChanged}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField type='time' InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start' >{t("task:addTask:from")}</InputAdornment>
                                    )
                                }}
                                defaultValue={startTime}
                                inputRef={this.startTimeRef}
                                onChange={this.onStartTimeChanged}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField type='time' InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>{t("task:addTask:to")}</InputAdornment>
                                    )
                                }}
                                defaultValue={endTime}
                                inputRef={this.endTimeRef}
                                onChange={this.onEndTimeChanged}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogContent>
                        <TextField
                        multiline
                        rows={4}
                        placeholder= {t("task:addTask:description")}
                        fullWidth
                        inputRef={this.textRef}
                        onInput={this.onDescriptionInput}/>
                    </DialogContent>
                    <DialogContent>
                        <FormControlLabel
                            control={
                                <Checkbox
                                checked={isTwoPersonTask}
                                value='checkedB'
                                color='secondary'
                                onClick={this.onCheckboxChecked}
                                inputRef={this.checkBoxRef}
                                disabled={this.state.chosenTask.requiresTwoWorkers}
                                />
                            }
                            label= {t("task:addTask:twoManTask")}
                            />
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={onBack}>Cancel</Button>
                    <Button variant='contained' color='secondary' onClick={this.onConfirmClick}
                    disabled={chosenTask.title.length <= 0 || taskDescription.length <= 0}>Confirm</Button>
                </DialogActions>
            </Fragment>
        );
    }
}