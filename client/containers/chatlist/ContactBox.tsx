import * as React from "react";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";

import * as userRx from "../../redux/user/userRx";
import * as teamRx from "../../redux/team/teamRx";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatroomRx from "../../chitchat/chats/redux/chatroom/chatroomRxEpic";

import { MemberList } from "./MemberList";

interface IComponentNameState { }

class ContactBox extends React.Component<IComponentProps, IComponentNameState> {

    _tempContact_id: string;

    componentWillMount() {
        console.log("ContactBox", this.props);

        this.onselectMember = this.onselectMember.bind(this);

        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer, teamReducer, userReducer } = nextProps;

        switch (chatroomReducer.state) {
            case chatroomRx.FETCH_PRIVATE_CHATROOM_SUCCESS:
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
                break;
            case chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE: {
                let contacts = teamReducer.members.filter((v, i) => {
                    return v._id === this._tempContact_id;
                });
                let members = chatroomActions.createChatRoom(userReducer.user, contacts[0]);
                this.props.dispatch(chatroomRx.createPrivateChatRoom(members.owner, members.contact));
                break;
            }
            case chatroomRx.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
            }
            default:
                break;
        }
    }

    onselectMember(data) {
        let { userReducer } = this.props;
        this._tempContact_id = data._id;
        this.props.dispatch(chatroomRx.fetchPrivateChatRoom(userReducer.user._id, this._tempContact_id));
    }

    public render(): JSX.Element {
        return (
            <div>
                <Subheader>Chats</Subheader>
                <MemberList items={this.props.teamReducer.members} onSelected={this.onselectMember} />
            </div>);
    }
}

export default ContactBox;
