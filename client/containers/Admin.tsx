import * as React from "react";
import { connect } from "react-redux";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from '../components/SimpleToolbar';
import AdminBox from './admins/AdminBox';
import ManageOrgChartBox from "./admins/ManageOrgChartBox";
import CreateGroupBox from "./admins/CreateGroupBox";
import { DialogBox } from "../components/DialogBox";
 
import { Room, RoomType, RoomStatus } from "../../server/scripts/models/Room";

enum BoxState {
    idle = 0, isCreateGroup = 1, isManageTeam,
};
interface IComponentNameState {
    boxState: BoxState;
    alert: boolean;
};

class Admin extends React.Component<IComponentProps, IComponentNameState> {
    alertTitle = "";
    alertMessage = "";

    manageOrgChart: string = "Manage ORG Chart";
    createOrgGroup: string = "create-org-group";
    createPjbGroup: string = "create-projectbase-group";
    createPvGroup: string = "create-group";
    menus = [this.manageOrgChart, this.createOrgGroup, this.createPjbGroup, this.createPvGroup];

    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert : false,
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
        this.onAlert = this.onAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    onAdminMenuSelected(key: string) {
        console.log('onAdminMenuSelected', key);

        if (key === this.createOrgGroup || key === this.createPjbGroup || key === this.createPvGroup) {
            this.setState(previous => ({ ...previous, boxState: BoxState.isCreateGroup }));
        }

        else if(key === this.manageOrgChart) {
            this.setState(previous => ({ ...previous, boxState: BoxState.isManageTeam }));
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
        this.setState(prevState => ({ ...prevState, alert: false }));
    }

    onAlert(error: string) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => ({ ...previous, alert: true }));
    }

    getAdminPanel() {
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return <ManageOrgChartBox {...this.props} onError={this.onAlert} />
            case BoxState.isCreateGroup:
                return <CreateGroupBox {...this.props} onError={this.onAlert} />
            default:
                return <AdminBox itemName={this.menus} onSelectItem={this.onAdminMenuSelected} />;
        }
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <div>
                    <SimpleToolbar title={'Admin'} onBackPressed={this.onBackPressed} />
                    {
                        this.getAdminPanel()
                    }
                    <DialogBox title={this.alertTitle} message={this.alertMessage} open={this.state.alert} handleClose={this.closeAlert} />
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapstateToProps = (state) => {
    return { ...state };
}
export default connect(mapstateToProps)(Admin);
