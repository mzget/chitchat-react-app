import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../utils/IComponentProps";

import * as userActions from "../redux/user/userActions";

import ChatLogsBox from "./ChatLogsBox";

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

interface IComponentNameState {};

class ChatList extends React.Component<IComponentNameProps, IComponentNameState> {
    
    componentWillMount() {
        console.log("ChatList", this.props);

        let { location: {query: {userId, username, roomId, contactId, agent_name}}, params } = this.props;

        if (params.filter) {
            this.props.dispatch(userActions.fetchUser(params.filter));
        }
    }
    

    public render(): JSX.Element {
        return (
            <div>
                <ChatLogsBox {...this.props} />
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
export default connect(mapStateToProps)(ChatList);
