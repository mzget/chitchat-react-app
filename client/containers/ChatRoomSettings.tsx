import * as React from "react";
import { connect } from "react-redux";
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { MenuListview } from "../components/MenuListView";
import { MemberList } from "./chatlist/MemberList";

const EDIT_GROUP = "EDIT_GROUP";
const GROUP_MEMBERS = "GROUP_MEMBERS";
enum BoxState {
    idle = 0, isEditGroup = 1, isEditMember
};
interface IComponentState {
    boxState: BoxState;
    alert: boolean;
}
class ChatRoomSettings extends React.Component<IComponentProps, IComponentState> {
    title = "Room settings";
    alertTitle = "Alert!";
    alertMessage = "";
    menus = [EDIT_GROUP, GROUP_MEMBERS];

    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert: false
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.onMenuSelected = this.onMenuSelected.bind(this);
        this.getViewPanel = this.getViewPanel.bind(this);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

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
                <MenuListview title={this.title} menus={this.menus} onSelectItem={this.onMenuSelected} />
                {
                    this.getViewPanel()
                }
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
    onMenuSelected(key: string) {
        console.log("onMenuSelected", key);
        if (key == GROUP_MEMBERS) {
            this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditMember }));
        }
    }

    getViewPanel() {
        switch (this.state.boxState) {
            case BoxState.isEditMember:
                return <MemberList
                    onSelected={null}
                    value={this.props.teamReducer.members}
                    rightIcon={
                        (<FloatingActionButton mini={true} style={{ marginRight: 20, marginBottom: 20 }}>
                            <ContentAdd />
                        </FloatingActionButton>)
                    }
                />;
            default:
                return null;
        }
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(ChatRoomSettings);