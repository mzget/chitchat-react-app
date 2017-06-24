import * as React from "react";
import Flexbox from "flexbox-react";
import { darkWhite, grey100, darkBlack } from "material-ui/styles/colors";
import { RaisedButton, Avatar } from "material-ui";
import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { Row, Col, Panel, FormGroup, FormControl } from 'react-bootstrap';
const Styles = require("../../styles/generalStyles");
const Profile = require("../../styles/profile");
const BoxShadow = Profile.Styles.boxShadow;
const ProfileBox = Profile.Styles.profileBox;
const DropdownBox = Profile.Styles.dropdownBox;
const MarginTopBottom = Styles.generalStyles.marginTopBottom;
const ManageUserBox = Profile.Styles.manageUserBox;
const SubmitButton = (props) => (React.createElement("div", { style: { width: "100%", padding: 5 } },
    React.createElement(RaisedButton, { primary: true, label: "submit", fullWidth: true, onClick: props.onSubmit, disabled: !props.canSubmit })));
const DeleteButton = (props) => (React.createElement(RaisedButton, { label: "delete", backgroundColor: "red", labelColor: "white", fullWidth: true }));
export const ContactProfileView = (props) => {
    return (React.createElement(Flexbox, { flexDirection: "row", height: "calc(100vh -56px)", style: { backgroundColor: darkWhite, width: "100%" } },
        React.createElement(Flexbox, { flexGrow: 1 }),
        React.createElement(Flexbox, { flexDirection: "column", minWidth: "400px", style: { overflowY: "auto", overflowX: "hidden", backgroundColor: grey100 } },
            React.createElement(Flexbox, { justifyContent: "center", alignItems: "center", padding: "10px", style: { backgroundColor: darkBlack } }, props.member.avatar
                ? React.createElement(Avatar, { src: props.member.avatar, size: 100 })
                : React.createElement(Avatar, { src: "https://thumb.ibb.co/hnoE5k/userdefault.png", size: 100 })),
            React.createElement("div", { style: { marginLeft: "2%", marginRight: "2%" } },
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
                                        React.createElement(SelectOrgChart, { dropdownItems: props.orgsRoleItems, dropdownValue: props.orgRoleValue, dropdownChange: props.dropdownChange })))),
                            React.createElement(Row, { style: { paddingTop: "2%" } },
                                React.createElement(Col, { md: 12 },
                                    React.createElement(Col, { xs: 12, md: 3 },
                                        React.createElement("strong", null, "Select Team Role : ")),
                                    React.createElement(Col, { xs: 12, md: 9 },
                                        React.createElement(SelectTeamRole, { teamRoleItems: props.teamRoleItems, teamRoleValue: props.teamRoleValue, onTeamRoleChange: props.onTeamRoleChange })))))))),
            React.createElement(Flexbox, { flexGrow: 1 }),
            React.createElement(SubmitButton, Object.assign({}, props))),
        React.createElement(Flexbox, { flexGrow: 1 })));
};
