"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const material_ui_1 = require("material-ui");
const Avatar_1 = require("material-ui/Avatar");
const FileReaderInput = require("react-file-reader-input");
const styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};
exports.ProfileDetail = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(reflexbox_1.Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Edit your profile")),
        React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : () => { } },
            React.createElement(Avatar_1.default, { src: props.image, size: 96, style: styles.avatar })),
        React.createElement(material_ui_1.TextField, { hintText: "email", value: props.email, disabled: true }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "first_name", errorText: "This field is required", value: props.first_name, onChange: props.onFirstNameChange }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "last_name", value: props.last_name, onChange: props.onLastNameChange }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }))));
