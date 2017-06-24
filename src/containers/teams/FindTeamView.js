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
const FindButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "Find Now", onClick: props.onSubmit }));
const CreateNewButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "Create New", onClick: props.onCreateNewPress }));
export const FindTeamView = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement(Flex, { flexColumn: true, align: 'center', justify: 'center' },
            React.createElement("h3", null, "Find your team"),
            React.createElement(TextField, { hintText: "Enter your team name", value: props.team_name, onChange: props.onNameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(FindButton, Object.assign({}, props)),
            React.createElement("span", { style: styles.span }),
            React.createElement(Flex, { flexColumn: false, align: 'center', justify: 'center' },
                React.createElement("p", null, "Create new team?"),
                React.createElement("span", { style: styles.span }),
                React.createElement(CreateNewButton, Object.assign({}, props))))));
};
