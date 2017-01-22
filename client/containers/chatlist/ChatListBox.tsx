import * as React from "react";

import { IComponentProps } from "../../utils/IComponentProps";

import * as userRx from "../../redux/user/userRx";
import * as teamRx from "../../redux/team/teamRx";

import { MemberList } from "./MemberList";

interface IComponentNameState { };

class ChatListBox extends React.Component<IComponentProps, IComponentNameState> {

    componentWillMount() {
        console.log("ChatList", this.props);

        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }


    public render(): JSX.Element {
        return (
            <div>
                <MemberList value={this.props.teamReducer.members} onSelected={(data) => {
                    this.props.router.push(`/chat/${data._id}`);
                } } />
            </div>);
    }
}

export default ChatListBox;
