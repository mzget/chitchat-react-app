import * as React from "react";
import { connect } from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from "../components/SimpleToolbar";
import { AdminMenu } from "./admins/AdminMenu";
import ManageOrgChartBox from "./admins/ManageOrgChartBox";
import CreateGroupBox, { createOrgGroup, createPjbGroup, createPvGroup } from "./admins/CreateGroupBox";
import { TeamMemberBox } from "./admins/TeamMemberBox";
import { DialogBox } from "../components/DialogBox";

import * as adminRx from "../redux/admin/adminRx";
import * as groupRx from "../redux/group/groupRx";

import { Room, RoomType, RoomStatus } from "../../server/scripts/models/Room";

enum BoxState {
    idle = 0, isCreateGroup = 1, isManageTeam, isManageMember
};
interface IComponentNameState {
    menuSelected: string;
    boxState: BoxState;
    alert: boolean;
};

class Admin extends React.Component<IComponentProps, IComponentNameState> {
    alertTitle = "";
    alertMessage = "";

    manageOrgChart: string = "Manage ORG Chart";
    teamMember: string = "team-member";
    menus = [this.manageOrgChart, createOrgGroup, createPjbGroup, createPvGroup, this.teamMember];

    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            menuSelected: "",
            alert: false,
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
        this.onAlert = this.onAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    componentDidMount() {
        const { teamReducer } = this.props;

        if (!teamReducer.team) {
            this.props.router.replace("/");
        }

        this.props.dispatch(adminRx.getOrgChart(teamReducer.team._id));
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        const { groupReducer, adminReducer } = nextProps;

        switch (groupReducer.state) {
            case groupRx.CREATE_ORG_GROUP_SUCCESS: {
                this.setState(prevState => ({ ...prevState, boxState: BoxState.idle }));
                break;
            }
            case groupRx.CREATE_ORG_GROUP_FAILURE: {
                this.onAlert(groupReducer.error);
                break;
            }
            default:
                break;
        }
    }

    onAdminMenuSelected(key: string) {
        console.log("onAdminMenuSelected", key);

        if (key == createOrgGroup || key == createPjbGroup || key == createPvGroup) {
            this.setState(previous => ({ ...previous, boxState: BoxState.isCreateGroup, menuSelected: key }));
        }
        else if (key == this.manageOrgChart) {
            this.setState(previous => ({ ...previous, boxState: BoxState.isManageTeam }));
        }
        else if (key == this.teamMember) {
            this.setState(previous => ({ ...previous, boxState: BoxState.isManageMember }));
        }
    }

    onBackPressed() {
        if (this.state.boxState) {
            this.setState(previous => ({ ...previous, boxState: BoxState.idle }));
        }
        else {
            // Jump to main menu.
            this.props.router.goBack();
        }
    }

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState, alert: false }), () => {
            this.props.dispatch(groupRx.emptyState());
            this.props.dispatch(adminRx.emptyState());
        });
    }

    onAlert(error: string) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => ({ ...previous, alert: true }));
    }

    getAdminPanel() {
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return <ManageOrgChartBox {...this.props} onError={this.onAlert} />;
            case BoxState.isCreateGroup:
                return <CreateGroupBox {...this.props} groupType={this.state.menuSelected} onError={this.onAlert} />;
            case BoxState.isManageMember:
                return <TeamMemberBox {...this.props} onError={this.onAlert} />;
            default:
                return <AdminMenu menus={this.menus} onSelectItem={this.onAdminMenuSelected} />;
        }
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <div>
                    <SimpleToolbar title={"Admin"} onBackPressed={this.onBackPressed} />
                    {
                        this.getAdminPanel()
                    }
                    <DialogBox title={this.alertTitle} message={this.alertMessage} open={this.state.alert} handleClose={this.closeAlert} />
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapstateToProps = (state) => ({ ...state });
export default connect(mapstateToProps)(Admin);
