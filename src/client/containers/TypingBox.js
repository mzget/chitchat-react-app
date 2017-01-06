"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const FileReaderInput = require("react-file-reader-input");
const FontIcon_1 = require("material-ui/FontIcon");
const IconButton_1 = require("material-ui/IconButton");
const styles = {
    span: {
        paddingRight: 2
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
const FileReaderBox = (props) => (React.createElement(FileReaderInput, { as: 'url', id: "file-input", onChange: props.fileReaderChange },
    React.createElement(IconButton_1.default, null,
        React.createElement(FontIcon_1.default, { className: "material-icons" }, "attachment"))));
const SendButton = (props) => (React.createElement(IconButton_1.default, { onClick: props.onSubmit },
    React.createElement(FontIcon_1.default, { className: "material-icons" }, "send")));
exports.TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, null,
            React.createElement(FileReaderBox, __assign({}, props)),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Type your message", value: props.value, onChange: props.onValueChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SendButton, { onSubmit: props.onSubmit }))));
};
