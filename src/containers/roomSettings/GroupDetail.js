"use strict";
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var material_ui_1 = require("material-ui");
var Avatar_1 = require("material-ui/Avatar");
var FileReaderInput = require("react-file-reader-input");
var styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};
exports.GroupDetail = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(reflexbox_1.Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Edit Group"),
            React.createElement("p", null, "Enter group informations")),
        React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : function () { }, disabled: props.disabledImage },
            React.createElement(Avatar_1["default"], { src: props.image, size: 96, style: styles.avatar })),
        React.createElement(material_ui_1.TextField, { hintText: "group name", errorText: "This field is required", value: props.group_name, onChange: props.onGroupNameChange, onKeyDown: function (e) {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "group description", value: props.group_description, onChange: props.onGroupDescriptionChange, onKeyDown: function (e) {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit })))); };
