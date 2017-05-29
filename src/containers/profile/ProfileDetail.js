"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var material_ui_1 = require("material-ui");
var Avatar_1 = require("material-ui/Avatar");
var FileReaderInput = require("react-file-reader-input");
var react_bootstrap_1 = require("react-bootstrap");
var material_ui_2 = require("material-ui");
var Styles = require("../../styles/generalStyles");
var PageBox = Styles.generalStyles.pageBox;
var PaddingZero = Styles.generalStyles.paddingZero;
var styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};
exports.ProfileDetail = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(react_bootstrap_1.Row, null,
        React.createElement(react_bootstrap_1.Col, { md: 10, mdOffset: 1 },
            React.createElement(react_bootstrap_1.Row, null,
                React.createElement(react_bootstrap_1.Col, { md: 12 },
                    React.createElement(material_ui_2.Card, null,
                        React.createElement(material_ui_2.CardTitle, { title: "Edit you profile", subtitle: "Edit you profile" })))),
            React.createElement(react_bootstrap_1.Row, null,
                React.createElement(react_bootstrap_1.Col, { md: 12 },
                    React.createElement("div", { style: Object.assign(PageBox, { backgroundColor: "white" }, Styles.generalStyles.marginTop1Percent) },
                        React.createElement(react_bootstrap_1.Row, null,
                            React.createElement(react_bootstrap_1.Col, { md: 12, style: { height: "150px" } },
                                React.createElement(react_bootstrap_1.Col, { md: 6, mdOffset: 3, style: Object.assign(Styles.generalStyles.heightFull, Styles.generalStyles.flexCenter) },
                                    React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : function () { } },
                                        React.createElement(Avatar_1["default"], { src: props.user.avatar, size: 96, style: styles.avatar }))))),
                        React.createElement(react_bootstrap_1.Row, null,
                            React.createElement("div", { style: { marginLeft: "2%", marginRight: "2%" } },
                                React.createElement(react_bootstrap_1.Col, { md: 10, mdOffset: 1 },
                                    React.createElement(react_bootstrap_1.Panel, { style: Object.assign(Styles.generalStyles.gridCenter) },
                                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "First Name :")),
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 8 },
                                                React.createElement(material_ui_1.TextField, { hintText: "first_name", errorText: "This field is required", value: props.user.firstname, onChange: props.onFirstNameChange }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "Last Name :")),
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 8 },
                                                React.createElement(material_ui_1.TextField, { hintText: "last_name", errorText: "This field is required", value: props.user.lastname, onChange: props.onLastNameChange }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "Tel :")),
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 8 },
                                                React.createElement(material_ui_1.TextField, { hintText: "tel", value: props.user.tel, onChange: props.onTelNumberChange }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "Email :")),
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 8 },
                                                React.createElement(material_ui_1.TextField, { hintText: "email", value: props.user.email, disabled: true }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "User Role :")),
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 8 },
                                                React.createElement(material_ui_1.TextField, { hintText: "user_role", value: props.teamProfile.team_role, disabled: true }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "User Status :")),
                                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 8 },
                                                React.createElement(material_ui_1.TextField, { hintText: "user_status", value: props.user.status, disabled: true }),
                                                React.createElement("span", { style: styles.span }))))))),
                        React.createElement(react_bootstrap_1.Row, null,
                            React.createElement(react_bootstrap_1.Col, { xs: 12, md: 10, mdOffset: 1, style: Styles.generalStyles.flexEnd },
                                React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: { margin: "2%" } })))))))))); };
