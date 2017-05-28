import * as React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";
import * as FileReaderInput from "react-file-reader-input";
import { Row, Col, Panel } from "react-bootstrap";
import { Card, CardTitle } from "material-ui";
const Styles = require("../../styles/generalStyles");
const PageBox = Styles.generalStyles.pageBox;
const PaddingZero = Styles.generalStyles.paddingZero;
const styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};
export const ProfileDetail = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Row, null,
        React.createElement(Col, { md: 10, mdOffset: 1 },
            React.createElement(Row, null,
                React.createElement(Col, { md: 12 },
                    React.createElement(Card, null,
                        React.createElement(CardTitle, { title: "Edit you profile", subtitle: "Edit you profile" })))),
            React.createElement(Row, null,
                React.createElement(Col, { md: 12 },
                    React.createElement("div", { style: Object.assign(PageBox, { backgroundColor: "white" }, Styles.generalStyles.marginTop1Percent) },
                        React.createElement(Row, null,
                            React.createElement(Col, { md: 12, style: { height: "150px" } },
                                React.createElement(Col, { md: 6, mdOffset: 3, style: Object.assign(Styles.generalStyles.heightFull, Styles.generalStyles.flexCenter) },
                                    React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : () => { } },
                                        React.createElement(Avatar, { src: props.user.avatar, size: 96, style: styles.avatar }))))),
                        React.createElement(Row, null,
                            React.createElement("div", { style: { marginLeft: "2%", marginRight: "2%" } },
                                React.createElement(Col, { md: 10, mdOffset: 1 },
                                    React.createElement(Panel, { style: Object.assign(Styles.generalStyles.gridCenter) },
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "First Name :")),
                                            React.createElement(Col, { xs: 12, md: 8 },
                                                React.createElement(TextField, { hintText: "first_name", errorText: "This field is required", value: props.user.firstname, onChange: props.onFirstNameChange }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "Last Name :")),
                                            React.createElement(Col, { xs: 12, md: 8 },
                                                React.createElement(TextField, { hintText: "last_name", errorText: "This field is required", value: props.user.lastname, onChange: props.onLastNameChange }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "Tel :")),
                                            React.createElement(Col, { xs: 12, md: 8 },
                                                React.createElement(TextField, { hintText: "tel", value: props.user.tel, onChange: props.onTelNumberChange }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "Email :")),
                                            React.createElement(Col, { xs: 12, md: 8 },
                                                React.createElement(TextField, { hintText: "email", value: props.user.email, disabled: true }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "User Role :")),
                                            React.createElement(Col, { xs: 12, md: 8 },
                                                React.createElement(TextField, { hintText: "user_role", value: props.teamProfile.team_role, disabled: true }),
                                                React.createElement("span", { style: styles.span }))),
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 4, style: { paddingTop: "3%" } },
                                                React.createElement("label", null, "User Status :")),
                                            React.createElement(Col, { xs: 12, md: 8 },
                                                React.createElement(TextField, { hintText: "user_status", value: props.user.status, disabled: true }),
                                                React.createElement("span", { style: styles.span }))))))),
                        React.createElement(Row, null,
                            React.createElement(Col, { xs: 12, md: 10, mdOffset: 1, style: Styles.generalStyles.flexEnd },
                                React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: { margin: "2%" } }))))))))));
