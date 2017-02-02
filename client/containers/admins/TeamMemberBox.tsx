import * as React from "react";

import { IComponentProps } from "../../utils/IComponentProps";

import { MemberList } from "../chatlist/MemberList";

import { ChitChatAccount } from "../../../server/scripts/models/User";

interface IComponentState {

};
export class TeamMemberBox extends React.Component<IComponentProps, IComponentState> {

    componentWillMount() {
        this.onSelectMember = this.onSelectMember.bind(this);
    }


    componentWillReceiveProps(nextProps) {

    }

    onSelectMember(item: ChitChatAccount) {
        console.dir(item);
    }

    render() {
        return (
            <div>
                <MemberList onSelected={this.onSelectMember} value={this.props.teamReducer.members} />
            </div>
        );
    }
}