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
const styles = {
    span: {
        paddingRight: 2
    },
    button: {
        margin: 12
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: styles.button }));
exports.SampleLoginForm = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, null,
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Type username here.", value: props.value, onChange: props.onValueChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SubmitButton, __assign({}, props)))));
};
