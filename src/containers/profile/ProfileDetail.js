"use strict";
exports.__esModule = true;
var React = require("react");
var flexbox_react_1 = require("flexbox-react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var material_ui_1 = require("material-ui");
var Avatar_1 = require("material-ui/Avatar");
var Subheader_1 = require("material-ui/Subheader");
var FileReaderInput = require("react-file-reader-input");
var Styles = require("../../styles/generalStyles");
var PageBox = Styles.generalStyles.pageBox;
var PaddingZero = Styles.generalStyles.paddingZero;
var styles = {
    span: {
        padding: 8
    },
    spanGap: {
        height: 8
    },
    avatar: {
        margin: 5
    },
    label: {
        marginLeft: 5,
        marginTop: 10
    },
    textBox: {
        marginRight: 5,
        marginLeft: 5
    }
};
var getDetailHeight = function () {
    return document.documentElement.clientHeight - (56 + 48);
};
exports.ProfileDetail = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(flexbox_react_1["default"], { style: { backgroundColor: Colors.blueGrey50 }, flexDirection: "column", minHeight: "calc(100vh - 56px)", id: "ProfileDetail" },
        React.createElement(flexbox_react_1["default"], { flexDirection: "column", alignItems: "center", flexGrow: 1 },
            React.createElement(Subheader_1["default"], null, "Edit you profile"),
            React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : function () { } },
                React.createElement(Avatar_1["default"], { src: props.user.avatar, size: 96, style: styles.avatar })),
            React.createElement("span", { style: styles.spanGap }),
            React.createElement(flexbox_react_1["default"], { flexDirection: "column", style: { backgroundColor: Colors.darkWhite, margin: 5 } },
                React.createElement(flexbox_react_1["default"], { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, " First Name :"),
                    React.createElement(flexbox_react_1["default"], { flexGrow: 1 }),
                    React.createElement(material_ui_1.TextField, { style: styles.textBox, hintText: "first_name", errorText: "This field is required", value: props.user.firstname, onChange: props.onFirstNameChange })),
                React.createElement(flexbox_react_1["default"], { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "Last Name :"),
                    React.createElement(flexbox_react_1["default"], { flexGrow: 1 }),
                    React.createElement(material_ui_1.TextField, { style: styles.textBox, hintText: "last_name", errorText: "This field is required", value: props.user.lastname, onChange: props.onLastNameChange })),
                React.createElement(flexbox_react_1["default"], { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "Tel :"),
                    React.createElement(flexbox_react_1["default"], { flexGrow: 1 }),
                    React.createElement(material_ui_1.TextField, { style: styles.textBox, hintText: "tel", value: props.user.tel, onChange: props.onTelNumberChange })),
                React.createElement(flexbox_react_1["default"], { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "Email :"),
                    React.createElement(flexbox_react_1["default"], { flexGrow: 1 }),
                    React.createElement(material_ui_1.TextField, { style: styles.textBox, hintText: "email", value: props.user.email, disabled: true })),
                React.createElement(flexbox_react_1["default"], { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "User Role :"),
                    React.createElement(flexbox_react_1["default"], { flexGrow: 1 }),
                    React.createElement(material_ui_1.TextField, { style: styles.textBox, hintText: "user_role", value: props.teamProfile.team_role, disabled: true })),
                React.createElement(flexbox_react_1["default"], { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "User Status :"),
                    React.createElement(flexbox_react_1["default"], { flexGrow: 1 }),
                    React.createElement(material_ui_1.TextField, { style: styles.textBox, hintText: "user_status", value: props.user.status, disabled: true }))),
            React.createElement("span", { style: styles.spanGap })),
        React.createElement(flexbox_react_1["default"], { justifyContent: "flex-end" },
            React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: { margin: "2%" } }))))); };
