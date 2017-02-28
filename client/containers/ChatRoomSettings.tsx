import * as React from "react";

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { MenuListview } from "../components/MenuListView";

const EDIT_GROUP = "EDIT_GROUP";
const GROUP_MEMBERS = "GROUP_MEMBERS";


interface IComponentState {
    alert: boolean;
}
class ChatRoomSettings extends React.Component<any, any> {
    title = "Room settings";
    alertTitle = "Alert!";
    alertMessage = "";
    menus = [EDIT_GROUP, GROUP_MEMBERS];

    componentWillMount() {
        this.state = {
            alert: false
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <SimpleToolbar title={this.title} onBackPressed={this.onBackPressed} />
                <MenuListview title={this.title} menus={this.menus} onSelectItem={this.onAdminMenuSelected} />
                <DialogBox
                    title={this.alertTitle}
                    message={this.alertMessage}
                    open={this.state.alert}
                    handleClose={this.closeAlert} />
            </div>
        );
    }

    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState }), () => {
            // this.props.dispatch(groupRx.emptyState());
            // this.props.dispatch(adminRx.emptyState());
        });
    }
    onAdminMenuSelected(key: string) {
        console.log("onAdminMenuSelected", key);
    }

    getAdminPanel() {
        switch (this.state.boxState) {
            default:
                return <MenuListview menus={this.menus} onSelectItem={this.onAdminMenuSelected} />;
        }
    }
}

export default ChatRoomSettings;