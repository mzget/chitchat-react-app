import * as React from "react";
import { shallowEqual } from "recompose";
import { connect } from "react-redux";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";

import * as teamRx from "../../redux/team/teamRx";
import * as chatroomActions from "stalk-simplechat/app/redux/chatroom/chatroomActions";
import * as chatroomRx from "stalk-simplechat/app/redux/chatroom/chatroomRxEpic";

import { MemberList } from "../../components/MemberList";

interface IComponentNameState { }

class Contacts extends React.Component<IComponentProps, IComponentNameState> {

    _tempContact_id: string = "";

    componentDidMount() {
        this.onselectMember = this.onselectMember.bind(this);

        if (!!this.props.teamReducer.team)
            this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer, teamReducer, userReducer } = nextProps;

        if (!shallowEqual(chatroomReducer, this.props.chatroomReducer)) {
            if (chatroomReducer.get("state") == chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE) {
                let contacts = teamReducer.members.filter((v, i) => {
                    return v._id === this._tempContact_id;
                });
                let members = chatroomActions.createPrivateChatRoomMembers(userReducer.user, contacts[0]);
                if (members) {
                    this.props.dispatch(chatroomRx.createPrivateChatRoom(members.owner, members.contact));
                }
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
                <Subheader>
                    Chats
                </Subheader>
                <MemberList items={this.props.teamReducer.members} onSelected={this.onselectMember} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    chatroomReducer: state.chatroomReducer,
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
});
export const ContactBox = connect(mapStateToProps)(Contacts);
