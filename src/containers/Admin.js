import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { MenuListview } from "./admins/MenuListView";
import { ManageOrgChartBox } from "./admins/ManageOrgChartBox";
import CreateGroupBox, { createOrgGroup, createPjbGroup, createPvGroup } from "./admins/CreateGroupBox";
import { TeamMemberBox } from "./admins/TeamMemberBox";
import { ChatRoomOverview } from "./ChatRoomOverview";
import * as adminRx from "../redux/admin/adminRx";
import * as groupRx from "../redux/group/groupRx";
import * as privateGroupRxActions from "../redux/group/privateGroupRxActions";
import { UserRole } from "../chitchat/chats/models/UserRole";
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isCreateGroup"] = 1] = "isCreateGroup";
    BoxState[BoxState["isManageTeam"] = 2] = "isManageTeam";
    BoxState[BoxState["isManageMember"] = 3] = "isManageMember";
    BoxState[BoxState["groupView"] = 4] = "groupView";
})(BoxState || (BoxState = {}));
class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.manageOrgChart = "Manage ORG Chart";
        this.teamMember = "team-member";
        this.developerIssue = "Developer Issue";
        this.menus = [this.manageOrgChart, createOrgGroup, createPjbGroup, createPvGroup, this.teamMember, this.developerIssue];
        this.state = {
            boxState: BoxState.idle,
            menuSelected: "",
            alert: false,
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
    }
    componentWillMount() {
        const { teamReducer, match, location } = this.props;
        if (!teamReducer.team || !teamReducer.team._id) {
            this.props.history.replace("/");
        }
        else {
            this.props.dispatch(adminRx.getOrgChart(teamReducer.team._id));
        }
    }
    componentWillReceiveProps(nextProps) {
        const { groupReducer, adminReducer, match, location } = nextProps;
        if (match.params.menu == "orgchart") {
            this.setState(previous => (Object.assign({}, previous, { boxState: BoxState.isManageTeam })));
        }
        else if (match.params.menu == "teamlist") {
            this.setState(previous => (Object.assign({}, previous, { boxState: BoxState.isManageMember })));
        }
        else if (match.params.menu == createPvGroup || match.params.menu == createOrgGroup) {
            this.setState(previous => (Object.assign({}, previous, { boxState: BoxState.isCreateGroup, menuSelected: match.params.menu })));
        }
        if (match.params.id) {
            this.setState(previous => (Object.assign({}, previous, { boxState: BoxState.groupView })));
        }
        if (groupReducer.state == groupRx.CREATE_ORG_GROUP_SUCCESS ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS) {
            this.setState(prevState => (Object.assign({}, prevState, { boxState: BoxState.idle })));
        }
        else if (groupReducer.state == groupRx.CREATE_ORG_GROUP_FAILURE ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_FAILURE) {
            this.props.onError(groupReducer.error);
        }
    }
    onAdminMenuSelected(key) {
        console.log("on-Admin-Menu-Selected", key);
        let { userReducer } = this.props;
        if (key == this.manageOrgChart) {
            if (userReducer.teamProfile.team_role == UserRole[UserRole.admin]) {
                this.props.history.push("/admin/orgchart");
            }
            else {
                this.props.onError("Request for admin permision");
            }
        }
        else if (key == createOrgGroup || key == createPjbGroup || key == createPvGroup) {
            if (key == createOrgGroup && userReducer.teamProfile.team_role != UserRole[UserRole.admin]) {
                return this.props.onError("Request for admin permision");
            }
            if (key == createPjbGroup) {
                return this.props.onError("Not yet ready...");
            }
            this.props.history.push(`/admin/${key}`);
        }
        else if (key == this.teamMember) {
            this.props.history.push("/admin/teamlist");
        }
        else if (key == this.developerIssue) {
            window.open("https://github.com/mzget/chitchat-ionic-reference-implementation/issues", '_blank');
        }
    }
    onBackPressed() {
        if (this.state.boxState) {
            this.setState(previous => (Object.assign({}, previous, { boxState: BoxState.idle })));
        }
        else {
            // Jump to main menu.
            this.props.history.goBack();
        }
    }
    getAdminPanel() {
        let { userReducer, match, onError } = this.props;
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return React.createElement(ManageOrgChartBox, Object.assign({}, this.props, { onError: this.props.onError }));
            case BoxState.isCreateGroup:
                return React.createElement(CreateGroupBox, Object.assign({}, this.props, { groupType: this.state.menuSelected, onError: this.props.onError }));
            case BoxState.isManageMember:
                return React.createElement(TeamMemberBox, Object.assign({}, this.props, { teamRole: userReducer.teamProfile.team_role, onError: this.props.onError }));
            case BoxState.groupView:
                return React.createElement(ChatRoomOverview, { match: match, onError: onError });
            default:
                return React.createElement(Subheader, null, "Welcome To Admin Panel!");
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider, null,
            React.createElement(Flexbox, { flexDirection: "column", style: { backgroundColor: Colors.blueGrey50 } },
                React.createElement("div", { style: { position: "relative", height: "56px" } },
                    React.createElement("div", { style: { position: "fixed", width: "100%", zIndex: 1 } },
                        React.createElement(SimpleToolbar, { title: "Admin", onBackPressed: this.onBackPressed }))),
                React.createElement(Flexbox, { flexDirection: "row", height: "calc(100vh - 56px)" },
                    React.createElement(Flexbox, { minWidth: "400px", justifyContent: "center" },
                        React.createElement(MenuListview, { menus: this.menus, onSelectItem: this.onAdminMenuSelected })),
                    React.createElement(Flexbox, { flexGrow: 1, justifyContent: "center" }, this.getAdminPanel())))));
    }
}
const mapstateToProps = (state) => (Object.assign({}, state));
export const AdminPage = withRouter(connect(mapstateToProps)(Admin));
