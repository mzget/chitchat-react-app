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
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const material_ui_1 = require("material-ui");
const SelectOrgChart_1 = require("../../components/SelectOrgChart");
const SelectTeamRole_1 = require("../../components/SelectTeamRole");
const react_bootstrap_1 = require("react-bootstrap");
const Styles = require("../../styles/generalStyles");
const Profile = require("../../styles/profile");
const BoxShadow = Profile.Styles.boxShadow;
const ProfileBox = Profile.Styles.profileBox;
const DropdownBox = Profile.Styles.dropdownBox;
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
exports.ContactProfileView = (props) => {
    {
        console.log(props);
    }
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(react_bootstrap_1.Row, null,
            React.createElement(react_bootstrap_1.Col, { md: 6, mdOffset: 3 },
                React.createElement("div", { style: Object.assign(Styles.generalStyles.paddingTop2Percent, Styles.generalStyles.paddingLeft2Percent, BoxShadow, { height: "calc(100vh - 56px)", padding: "0" }) },
                    React.createElement("div", { style: Object.assign({ height: "200px", backgroundColor: "#333b3e" }, Styles.generalStyles.flexCenter) }, props.member.avatar ? React.createElement("img", { src: props.member.avatar, width: "150", height: "150" }) : React.createElement("img", { src: "https://thumb.ibb.co/hnoE5k/userdefault.png", width: "150", height: "150" })),
                    React.createElement("div", null,
                        React.createElement("div", { style: Object.assign(ProfileBox, Styles.generalStyles.flexStart) },
                            React.createElement(react_bootstrap_1.Col, { xs: 4, md: 3 },
                                React.createElement("strong", null, "Username : ")),
                            React.createElement(react_bootstrap_1.Col, { xs: 8, md: 9 },
                                React.createElement(react_bootstrap_1.FormGroup, { style: { margin: "0" } },
                                    React.createElement(react_bootstrap_1.FormControl, { value: props.member.username, disabled: true })))),
                        React.createElement("div", { style: Object.assign(ProfileBox, Styles.generalStyles.flexStart) },
                            React.createElement(react_bootstrap_1.Col, { xs: 4, md: 3 },
                                React.createElement("strong", null, "Name : ")),
                            React.createElement(react_bootstrap_1.Col, { xs: 8, md: 9 },
                                React.createElement(react_bootstrap_1.FormGroup, { style: { margin: "0" } },
                                    React.createElement(react_bootstrap_1.FormControl, { value: props.member.firstname + " " + props.member.lastname, disabled: true })))),
                        React.createElement("div", { style: Object.assign(ProfileBox, Styles.generalStyles.flexStart) },
                            React.createElement(react_bootstrap_1.Col, { xs: 4, md: 3 },
                                React.createElement("strong", null, "Email : ")),
                            React.createElement(react_bootstrap_1.Col, { xs: 8, md: 9 },
                                React.createElement(react_bootstrap_1.FormGroup, { style: { margin: "0" } },
                                    React.createElement(react_bootstrap_1.FormControl, { value: props.member.email ? props.member.email : "not set", disabled: true })))),
                        React.createElement("div", { style: Object.assign(DropdownBox, Styles.generalStyles.flexStart) },
                            React.createElement(react_bootstrap_1.Col, { xs: 4, md: 3 },
                                React.createElement("strong", null, "Select Org. Group : ")),
                            React.createElement(react_bootstrap_1.Col, { xs: 8, md: 9 },
                                React.createElement(SelectOrgChart_1.SelectOrgChart, { dropdownItems: props.dropdownItems, dropdownValue: props.dropdownValue, dropdownChange: props.dropdownChange }))),
                        React.createElement("div", { style: Object.assign(DropdownBox, Styles.generalStyles.flexCenter) },
                            React.createElement(react_bootstrap_1.Col, { xs: 4, md: 3 },
                                React.createElement("strong", null, "Select Team Role : ")),
                            React.createElement(react_bootstrap_1.Col, { xs: 8, md: 9 },
                                React.createElement(SelectTeamRole_1.SelectTeamRole, { teamRoleItems: props.teamRoleItems, teamRoleValue: props.teamRoleValue, onTeamRoleChange: props.onTeamRoleChange })))),
                    React.createElement("div", { style: Styles.generalStyles.flexCenter },
                        React.createElement(react_bootstrap_1.Col, { md: 12 },
                            React.createElement(react_bootstrap_1.FormGroup, null,
                                React.createElement(react_bootstrap_1.FormControl.Static, { style: { textAlign: "right" } },
                                    React.createElement(SubmitButton, __assign({}, props)))))))))));
};
