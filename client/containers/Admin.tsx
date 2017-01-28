import * as React from "react";
import { connect } from "react-redux";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from '../components/SimpleToolbar';
import AdminBox from './admins/AdminBox';
import CreateGroupBox from "./group/CreateGroupBox";
 
import { Room, RoomType, RoomStatus } from "../../server/scripts/models/Room";

interface IComponentNameState {
    isCreateGroup: boolean;
};

class Admin extends React.Component<IComponentProps, IComponentNameState> {
    menus = ["create-org-group", "create-projectbase-group", "create-group"];

    componentWillMount() {
        this.state = {
            isCreateGroup: false
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
    }

    onAdminMenuSelected(key: string) {
        console.log('onAdminMenuSelected', key);

        if (key === this.menus[0]) {
            this.setState(previous => ({ ...previous, isCreateGroup: true }));
        }
    }

    onBackPressed() {
        if (this.state.isCreateGroup) {
            this.setState(previous => ({ ...previous, isCreateGroup: false }));
        }
        else {
            // Jump to main menu.
            this.props.router.goBack();
        }
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <div>
                    <SimpleToolbar title={'Admin'} onBackPressed={this.onBackPressed} />
                    {
                        (!this.state.isCreateGroup) ?
                        <AdminBox itemName={this.menus} onSelectItem={this.onAdminMenuSelected} />
                        :
                        <CreateGroupBox {...this.props} />
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapstateToProps = (state) => {
    return { ...state };
}
export default connect(mapstateToProps)(Admin);
