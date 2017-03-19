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
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Create Team", onClick: props.onCreateTeam }));
const FindButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Find Team", onClick: props.onFindTeam }));
exports.TeamCreateView = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, { flexColumn: true, align: 'center', justify: 'center' },
            React.createElement("h3", null, "Create a new team"),
            React.createElement(material_ui_1.TextField, { hintText: "Team name", value: props.team_name, onChange: props.onNameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onCreateTeam();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SubmitButton, Object.assign({}, props)),
            React.createElement("span", { style: styles.span }),
            React.createElement(reflexbox_1.Flex, { flexColumn: false, align: 'center', justify: 'center' },
                React.createElement("p", null, "Looking for existing team?"),
                React.createElement("span", { style: styles.span }),
                React.createElement(FindButton, Object.assign({}, props))))));
};
