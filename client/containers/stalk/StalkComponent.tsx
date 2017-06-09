import * as React from "react";
import { connect } from "react-redux";
import Flexbox from 'flexbox-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { WarningBar } from "../../components/WarningBar";
import { LinearProgressDialog } from "../../components/LinearProgressDialog";

import { IComponentProps } from "../../utils/IComponentProps";

import * as StalkBridgeActions from "../../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatroomRx from "../../chitchat/chats/redux/chatroom/chatroomRxEpic";

class StalkComponent extends React.Component<any, any> {
    render() {
        return (
            <div style={{width:"100%"}}>
                {
                    (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT_FAILURE ||
                        this.props.stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ?
                        <WarningBar /> : null
                }
                {
                    (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT) ?
                        <LinearProgressDialog title={"Joining... stalk service"}
                            open={true}
                            handleClose={() => { }} /> : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    stalkReducer: state.stalkReducer,
    userReducer: state.userReducer
});
export const StalkCompEnhancer = connect(mapStateToProps)(StalkComponent);