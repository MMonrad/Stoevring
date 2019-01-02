import * as React from 'react';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import DirectoryPicture from 'src/react/Directory/Picture/Card/DirectoryPictureCard';
import Fuse from 'fuse.js';
import styles from 'src/react/Task/Add/AutoSuggestion/TaskAddAutoSuggestion.styles';
import { translate } from 'react-i18next'


const fuseOptions = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: ['fullName'],
};

const getSuggestionValue = suggestion => suggestion.fullName;

@withStyles(styles)
@translate(['task'])
export default class TaskAddAutoSuggestion extends React.PureComponent {
    popperNode = null;

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
        }
    }

    renderSuggestion = suggestion => {
        return (
        <MenuItem component='div' onClick={() => this.props.onCitizenSelectedCallback(suggestion)} onKeyUp={() => this.onCitizenSelectedWithEnterKey(suggestion)}>
            <ListItemIcon>
                <DirectoryPicture userId={suggestion.id}/>
            </ListItemIcon>
            <ListItemText primary={suggestion.fullName}/>
        </MenuItem>)
    }

    getSuggestions = value => {
        const {citizenData} = this.props;
        const inputValue = value.trim().toLowerCase();
        const fuse = new Fuse(Object.values(citizenData), fuseOptions);

        return fuse.search(inputValue).slice(0, 5);
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
    }

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    }

    renderSuggestionsContainer = ({containerProps, children}) => {
        return(
            <MenuList {...containerProps}>
                {children}
            </MenuList>
        )
    }

    renderInputComponent = (inputProps) => {
        const {classes, inputRef = () => {}, ref, ...other } = inputProps;
        const { t } = this.props;
        
        return(
            <TextField
            fullWidth
            placeholder= {t("task:addTask:enterCitizenName")}
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                    this.popperNode = node;
                },
            }}
            {...other}
            />
        );
    }

    render() {
        const {value, suggestions} = this.state;
        const {classes, t} = this.props;
        const inputProps = {
            placeholder: t("task:addTask:enterCitizenName"),
            value: value,
            onChange: this.onChange,
            InputLabelProps: {
                shrink: true,
            },
        };
        return(
            <div className={classes.root}>
                <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={this.renderInputComponent}
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                //Z-index = 1301 as Dialog has a z-index of 1300, so otherwise the popover would appear behind it.
                renderSuggestionsContainer={options => (
                    <Popper 
                    anchorEl={this.popperNode} 
                    open={Boolean(options.children)} 
                    style={{zIndex: 1301}} 
                    placement='bottom-start'
                    >
                        <Paper {...options.containerProps} square style={{ width: this.popperNode ? this.popperNode.clientWidth : null }}>
                            {options.children}
                        </Paper>
                    </Popper>
                )}
                />
            </div>
        );
    }
}