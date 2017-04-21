import * as React from "react";
import { shallowEqual } from "recompose";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";

import * as userRx from "../../redux/user/userRx";
import * as teamRx from "../../redux/team/teamRx";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatroomRx from "../../chitchat/chats/redux/chatroom/chatroomRxEpic";

import { MemberList } from "./MemberList";

interface IComponentNameState { }

export class ContactBox extends React.Component<IComponentProps, IComponentNameState> {

    _tempContact_id: string;

    componentDidMount() {
        this.onselectMember = this.onselectMember.bind(this);

        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer, teamReducer, userReducer } = nextProps;

        if (!shallowEqual(chatroomReducer, this.props.chatroomReducer)) {
            if (chatroomReducer.state == chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE) {
                let contacts = teamReducer.members.filter((v, i) => {
                    return v._id === this._tempContact_id;
                });
                let members = chatroomActions.createChatRoom(userReducer.user, contacts[0]);
                this.props.dispatch(chatroomRx.createPrivateChatRoom(members.owner, members.contact));
            }
        }
    }

    onselectMember(data) {
        let { userReducer } = this.props;
        this._tempContact_id = data._id;

        this.props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(() =>
            this.props.dispatch(chatroomRx.fetchPrivateChatRoom(userReducer.user._id, this._tempContact_id)));
    }

    public render(): JSX.Element {
        return (
            <div>
                <Subheader>Chats</Subheader>
                <MemberList items={this.props.teamReducer.members} onSelected={this.onselectMember} />
            </div>);
    }
}
