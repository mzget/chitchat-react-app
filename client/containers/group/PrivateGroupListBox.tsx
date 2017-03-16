import * as React from "react";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";

import * as userRx from "../../redux/user/userRx";
import * as teamRx from "../../redux/team/teamRx";
import * as chatroomActions from "../../redux/chatroom/chatroomActions";
import * as chatroomRx from "../../redux/chatroom/chatroomRxEpic";
import * as privateGroupRxActions from "../../redux/group/privateGroupRxActions";

import { GroupList } from "./GroupList";

interface IComponentNameState { };

class PrivateGroupListBox extends React.Component<IComponentProps, IComponentNameState> {

    componentWillMount() {
        console.log("PrivateGroupListBox", this.props);

        this.onselectGroup = this.onselectGroup.bind(this);

        this.props.dispatch(privateGroupRxActions.getPrivateGroup(this.props.teamReducer.team._id));
    }

    onselectGroup(data) {
        this.props.dispatch(chatroomActions.getPersistendChatroom(data._id));
    }

    public render(): JSX.Element {
        return (
            <div>
                <Subheader>Groups</Subheader>
                <GroupList values={this.props.groupReducer.privateGroups} onSelected={this.onselectGroup} />
            </div>);
    }
}

const PrivateGroupListView = () => (
    <div>
        <Subheader>Groups</Subheader>
        <GroupList values={this.props.groupReducer.privateGroups} onSelected={this.onselectGroup} />
    </div>);

export default PrivateGroupListBox;
