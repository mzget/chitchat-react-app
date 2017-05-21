var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";
import * as FileReaderInput from "react-file-reader-input";
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
    },
    toolbar: {
        height: 56
    }
};
const SubmitButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
export const CreateGroupView = (props) => (comp) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", { style: { height: (document.documentElement.clientHeight - styles.toolbar.height), backgroundColor: Colors.indigo50 } },
        React.createElement(Flex, { flexColumn: true, align: "center" },
            React.createElement(Box, { justify: "center", align: "center", p: 2 },
                React.createElement("h3", null, "Create Group"),
                React.createElement("p", null, "Enter group informations")),
            React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : () => { }, disabled: props.disabledImage },
                React.createElement(Avatar, { src: props.image, size: 96, style: styles.avatar })),
            React.createElement(TextField, { hintText: "group name", errorText: "This field is required", value: props.group_name, onChange: props.onGroupNameChange, onKeyDown: (e) => {
                    if (e.key === "Enter")
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { hintText: "group description", value: props.group_description, onChange: props.onGroupDescriptionChange, onKeyDown: (e) => {
                    if (e.key === "Enter")
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            comp,
            React.createElement(SubmitButton, __assign({}, props))))));
