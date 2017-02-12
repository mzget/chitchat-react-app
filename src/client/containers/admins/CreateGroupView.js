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
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const material_ui_1 = require("material-ui");
const Avatar_1 = require("material-ui/Avatar");
const styles = {
    span: {
        padding: 8
    },
    box: {
        bottom: 0,
        position: "absolute"
    },
    avatar: {
        margin: 5
    }
};
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
exports.CreateGroupView = (props) => (comp) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(reflexbox_1.Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Create Group"),
            React.createElement("p", null, "Enter group informations")),
        React.createElement(Avatar_1.default, { src: props.image, size: 96, style: styles.avatar }),
        React.createElement(material_ui_1.TextField, { hintText: "group name", errorText: "This field is required", value: props.group_name, onChange: props.onGroupNameChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "group description", value: props.group_description, onChange: props.onGroupDescriptionChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        comp,
        React.createElement(SubmitButton, __assign({}, props)))));
