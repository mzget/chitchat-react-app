import * as React from "react";
import { Flex, Box } from "reflexbox";

import { IComponentProps } from "../../utils/IComponentProps";

import { MemberList } from "../chatlist/MemberList";
import { ContactProfile } from "./ContactProfile";

import { ChitChatAccount } from "../../../server/scripts/models/User";

interface IComponentState {
    member: ChitChatAccount;
    dropdownValue: number;
};
export class TeamMemberBox extends React.Component<IComponentProps, IComponentState> {

    componentWillMount() {
        this.state = {
            member: null,
            dropdownValue: 0
        };

        this.onSelectMember = this.onSelectMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    componentWillReceiveProps(nextProps) {

    }

    onSelectMember(item: ChitChatAccount) {
        this.setState(previous => ({ ...previous, member: item }));
    }

    onSubmit() {
        let {adminReducer: {orgCharts}} = this.props;

        let _member = this.state.member;
        _member.org_chart_id = orgCharts[this.state.dropdownValue]._id;

        if (_member) {
            console.log(_member);
        }
        else {
            if (this.props.onError) {
                this.props.onError("WTF");
            }
        }
    }

    render() {
        return (
            <Flex flexColumn={false}>
                <Box p={2} flexAuto></Box>
                <Flex flexColumn align="center">
                    {
                        (!!this.state.member) ?
                            <ContactProfile
                                member={this.state.member}
                                onSubmit={this.onSubmit}
                                dropdownItems={this.props.adminReducer.orgCharts}
                                dropdownValue={this.state.dropdownValue}
                                dropdownChange={(event, id, value) => { this.setState(previous => ({ ...previous, dropdownValue: value })) }}
                            />
                            :
                            <MemberList onSelected={this.onSelectMember} value={this.props.teamReducer.members} />
                    }
                </Flex>
                <Box p={2} flexAuto></Box>
            </Flex>
        );
    }
}