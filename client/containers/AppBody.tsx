import * as React from "react";
import { connect } from "react-redux";

import { ChatPage } from "./Chat";
import { Post } from "./Post";

import { IComponentProps } from "../utils/IComponentProps";
import { SMALL_TABLET, MEDIUM_HANDSET } from "../chitchat/consts/Breakpoints";

class AppBody extends React.Component<IComponentProps, any> {
    render() {
        let { chatroomReducer } = this.props;
        return (
            <div>
                {(chatroomReducer.room) ? <ChatPage /> : <Post />}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    chatroomReducer: state.chatroomReducer
});
export const ConnectedAppBody = connect(mapStateToProps)(AppBody);