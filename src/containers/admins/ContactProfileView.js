var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, Card, CardTitle } from "material-ui";
import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { Row, Col, Panel, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
const Styles = require("../../styles/generalStyles");
const Profile = require("../../styles/profile");
const BoxShadow = Profile.Styles.boxShadow;
const ProfileBox = Profile.Styles.profileBox;
const DropdownBox = Profile.Styles.dropdownBox;
const MarginTopBottom = Styles.generalStyles.marginTopBottom;
const ManageUserBox = Profile.Styles.manageUserBox;
const SubmitButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
const DeleteButton = (props) => (React.createElement(RaisedButton, { label: "delete", backgroundColor: "red", labelColor: "white", fullWidth: true }));
export const ContactProfileView = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement(Row, null,
            React.createElement(Col, { md: 6, mdOffset: 3 },
                React.createElement(Card, null,
                    React.createElement(CardTitle, { title: "User Profile", subtitle: "User Profile" })),
                React.createElement("div", { style: Object.assign(Styles.generalStyles.paddingTop2Percent, Styles.generalStyles.paddingLeft2Percent, BoxShadow, { padding: "0" }) },
                    React.createElement("div", { style: Object.assign({ height: "200px", backgroundColor: "#333b3e" }, Styles.generalStyles.flexCenter) }, props.member.avatar ? React.createElement("img", { src: props.member.avatar, width: "150", height: "150" }) : React.createElement("img", { src: "https://thumb.ibb.co/hnoE5k/userdefault.png", width: "150", height: "150" })),
                    React.createElement("div", { style: { marginLeft: "2%", marginRight: "2%" } },
                        React.createElement(Row, { style: Styles.generalStyles.marginZero },
                            React.createElement("div", { style: Object.assign(ManageUserBox) },
                                React.createElement(Col, { md: 10, mdOffset: 1, style: Object.assign(Styles.generalStyles.flexEnd, Styles.generalStyles.paddingZero) },
                                    React.createElement(Col, { xs: 6, md: 4, style: Styles.generalStyles.paddingZero },
                                        React.createElement(FormGroup, { controlId: "formControlsSelect" },
                                            React.createElement(ControlLabel, null, "Manage User"),
                                            React.createElement(FormControl, { componentClass: "select", placeholder: "select" },
                                                React.createElement("option", { value: "select", disabled: true, selected: true }, "Select action"),
                                                React.createElement("option", { value: "other" }, "Delete User"))))))),
                        React.createElement(Row, { style: Styles.generalStyles.marginZero },
                            React.createElement(Col, { md: 10, mdOffset: 1, style: Styles.generalStyles.paddingZero },
                                React.createElement(Panel, null,
                                    React.createElement(Row, null,
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 3 },
                                                React.createElement("strong", null, "Username : ")),
                                            React.createElement(Col, { xs: 12, md: 9 },
                                                React.createElement(FormGroup, { style: { margin: "0" } },
                                                    React.createElement(FormControl, { value: props.member.username, disabled: true }))))),
                                    React.createElement(Row, { style: { paddingTop: "2%" } },
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 3 },
                                                React.createElement("strong", null, "Name : ")),
                                            React.createElement(Col, { xs: 12, md: 9 },
                                                React.createElement(FormGroup, { style: { margin: "0" } },
                                                    React.createElement(FormControl, { value: props.member.firstname + " " + props.member.lastname, disabled: true }))))),
                                    React.createElement(Row, { style: { paddingTop: "2%" } },
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 3 },
                                                React.createElement("strong", null, "Email : ")),
                                            React.createElement(Col, { xs: 12, md: 9 },
                                                React.createElement(FormGroup, { style: { margin: "0" } },
                                                    React.createElement(FormControl, { value: props.member.email ? props.member.email : "not set", disabled: true }))))),
                                    React.createElement(Row, { style: { paddingTop: "2%" } },
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 3 },
                                                React.createElement("strong", null, "Select Org. Group : ")),
                                            React.createElement(Col, { xs: 12, md: 9 },
                                                React.createElement(SelectOrgChart, { dropdownItems: props.dropdownItems, dropdownValue: props.dropdownValue, dropdownChange: props.dropdownChange })))),
                                    React.createElement(Row, { style: { paddingTop: "2%" } },
                                        React.createElement(Col, { md: 12 },
                                            React.createElement(Col, { xs: 12, md: 3 },
                                                React.createElement("strong", null, "Select Team Role : ")),
                                            React.createElement(Col, { xs: 12, md: 9 },
                                                React.createElement(SelectTeamRole, { teamRoleItems: props.teamRoleItems, teamRoleValue: props.teamRoleValue, onTeamRoleChange: props.onTeamRoleChange }))))))),
                        React.createElement(Row, null,
                            React.createElement(Col, { md: 10, mdOffset: 1 },
                                React.createElement(Row, null,
                                    React.createElement(Col, { md: 12 },
                                        React.createElement(FormGroup, null,
                                            React.createElement(FormControl.Static, { style: Styles.generalStyles.flexEnd },
                                                React.createElement(SubmitButton, __assign({}, props))))))))))))));
};
