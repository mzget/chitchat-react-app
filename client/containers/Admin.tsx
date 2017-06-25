import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { MenuListview } from "./admins/MenuListView";
import { ManageOrgChartBox } from "./admins/ManageOrgChartBox";
import CreateGroupBox, { createOrgGroup, createPjbGroup, createPvGroup } from "./admins/CreateGroupBox";
import { TeamMemberBox } from "./admins/TeamMemberBox";
import { DialogBox } from "../components/DialogBox";
import { GroupPureEnhanced } from "./admins/Group";

import * as adminRx from "../redux/admin/adminRx";
import * as groupRx from "../redux/group/groupRx";
import * as privateGroupRxActions from "../redux/group/privateGroupRxActions";
import { Room, RoomType, RoomStatus } from "../chitchat/chats/models/Room";
import { UserRole } from "../chitchat/chats/models/UserRole";

enum BoxState {
    idle = 0, isCreateGroup = 1, isManageTeam, isManageMember, groupView
}
interface IComponentNameState {
    menuSelected: string;
    boxState: BoxState;
    alert: boolean;
}

class Admin extends React.Component<IComponentProps, IComponentNameState> {
    manageOrgChart: string = "Manage ORG Chart";
    teamMember: string = "team-member";
    developerIssue: string = "Developer Issue";
    menus = [this.manageOrgChart, createOrgGroup, createPjbGroup, createPvGroup, this.teamMember, this.developerIssue];

    constructor(props) {
        super(props);

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

    componentWillReceiveProps(nextProps: IComponentProps) {
        const { groupReducer, adminReducer, alertReducer, match, location } = nextProps;

        console.log(match.params);

        if (!shallowEqual(alertReducer.error, this.props.alertReducer.error) && !!alertReducer.error) {
            this.props.onError(alertReducer.error);
        }

        if (match.params.menu == "orgchart") {
            this.setState(previous => ({ ...previous, boxState: BoxState.isManageTeam }));
        }
        else if (match.params.menu == "teamlist") {
            this.setState(previous => ({ ...previous, boxState: BoxState.isManageMember }));
        }
        else if (match.params.menu == createPvGroup || match.params.menu == createOrgGroup) {
            this.setState(previous => ({ ...previous, boxState: BoxState.isCreateGroup, menuSelected: match.params.menu }));
        }

        if (match.params.id) {
            this.setState(previous => ({ ...previous, boxState: BoxState.groupView }));
        }

        if (groupReducer.state == groupRx.CREATE_ORG_GROUP_SUCCESS ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS) {
            this.setState(prevState => ({ ...prevState, boxState: BoxState.idle }));
        }
        else if (groupReducer.state == groupRx.CREATE_ORG_GROUP_FAILURE ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_FAILURE) {
            this.props.onError(groupReducer.error);
        }
    }

    onAdminMenuSelected(key: string) {
        let { userReducer } = this.props;

        if (key == this.manageOrgChart) {
            this.props.history.push("/admin/orgchart");
            //@ No need to check admin role.
            // if (userReducer.teamProfile.team_role == UserRole[UserRole.admin]) {
            // }
            // else {
            //     this.props.onError("Request for admin permision");
            // }
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
            this.setState(previous => ({ ...previous, boxState: BoxState.idle }));
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
                return <ManageOrgChartBox onError={this.props.onError} />;
            case BoxState.isCreateGroup:
                return <CreateGroupBox {...this.props} groupType={this.state.menuSelected} onError={this.props.onError} />;
            case BoxState.isManageMember:
                return <TeamMemberBox {...this.props} teamRole={userReducer.teamProfile.team_role} onError={this.props.onError} />;
            case BoxState.groupView:
                return <GroupPureEnhanced room_id={match.params.id} />;
            default:
                return <Subheader>Welcome To Admin Panel!</Subheader>;
        }
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                    <div style={{ position: "relative", height: "56px" }}>
                        <div style={{ position: "fixed", width: "100%", zIndex: 1 }} >
                            <SimpleToolbar title={"Admin"} onBackPressed={this.onBackPressed} />
                        </div>
                    </div>
                    <Flexbox flexDirection="row" height="calc(100vh - 56px)">
                        <Flexbox minWidth="400px" justifyContent="center">
                            <MenuListview menus={this.menus} onSelectItem={this.onAdminMenuSelected} />
                        </Flexbox>
                        <Flexbox flexGrow={1} justifyContent="center">
                            {
                                this.getAdminPanel()
                            }
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </MuiThemeProvider >
        );
    }
}

const mapstateToProps = (state) => ({ ...state });
export const AdminPage = withRouter(connect(mapstateToProps)(Admin));
