import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../utils/IComponentProps";

import * as userActions from "../redux/user/userActions";

import ChatLogsBox from "./ChatLogsBox";
import SimpleToolbar from '../components/Toolbar';

abstract class IComponentNameProps implements IComponentProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
            agent_name: string;
        }
    };
    params;
    router;
    dispatch;
    authReducer;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
};

interface IComponentNameState { };

class ChatListBox extends React.Component<IComponentNameProps, IComponentNameState> {

    componentWillMount() {
        console.log("ChatList", this.props);
    }


    public render(): JSX.Element {
        return (
            <div>
            </div>);
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}
export default connect(mapStateToProps)(ChatListBox);
