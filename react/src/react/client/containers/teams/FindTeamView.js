"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
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
const FindButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Find Now", onClick: props.onSubmit }));
const CreateNewButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Create New", onClick: props.onCreateNewPress }));
exports.FindTeamView = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, { flexColumn: true, align: 'center', justify: 'center' },
            React.createElement("h3", null, "Find your team"),
            React.createElement(material_ui_1.TextField, { hintText: "Enter your team name", value: props.team_name, onChange: props.onNameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(FindButton, Object.assign({}, props)),
            React.createElement("span", { style: styles.span }),
            React.createElement(reflexbox_1.Flex, { flexColumn: false, align: 'center', justify: 'center' },
                React.createElement("p", null, "Create new team?"),
                React.createElement("span", { style: styles.span }),
                React.createElement(CreateNewButton, Object.assign({}, props))))));
};
