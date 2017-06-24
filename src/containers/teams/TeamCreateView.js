import * as React from "react";
import { Flex } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const styles = {
    span: {
        padding: 8
    },
    button: {
        width: '100%'
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
const SubmitButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "Create Team", onClick: props.onCreateTeam }));
const FindButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "Find Team", onClick: props.onFindTeam }));
export const TeamCreateView = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement(Flex, { flexColumn: true, align: 'center', justify: 'center' },
            React.createElement("h3", null, "Create a new team"),
            React.createElement(TextField, { hintText: "Team name", value: props.team_name, onChange: props.onNameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onCreateTeam();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SubmitButton, Object.assign({}, props)),
            React.createElement("span", { style: styles.span }),
            React.createElement(Flex, { flexColumn: false, align: 'center', justify: 'center' },
                React.createElement("p", null, "Looking for existing team?"),
                React.createElement("span", { style: styles.span }),
                React.createElement(FindButton, Object.assign({}, props))))));
};
