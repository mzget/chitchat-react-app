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
    avatar: {
        margin: 5
    }
};
export const GroupDetail = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Edit Group"),
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
        React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }))));
