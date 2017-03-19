import * as React from "react";
import { Flex, Box } from "reflexbox";

import { IComponentProps } from "../../utils/IComponentProps";

import { MemberList } from "../chatlist/MemberList";
import { ContactProfileView } from "./ContactProfileView";

import * as adminRx from "../../redux/admin/adminRx";

import { ITeamMember } from "../../chats/models/ITeamMember";
import { IOrgChart } from "../../../server/scripts/models/OrgChart";

interface IComponentState {
    member: ITeamMember;
    dropdownValue: number;
};
export class TeamMemberBox extends React.Component<IComponentProps, IComponentState> {

    orgChart_id: string;

    componentWillMount() {
        this.state = {
            member: null,
            dropdownValue: 0
        };

        this.onSelectMember = this.onSelectMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { adminReducer } = nextProps;

        switch (adminReducer.state) {
            case adminRx.UPDATE_USER_ORG_CHART_FAILURE: {
                this.props.onError(adminReducer.error);
                break;
            }
            case adminRx.UPDATE_USER_ORG_CHART_SUCCESS: {
                this.setState(previous => ({ ...previous, member: null }));
                this.props.dispatch(adminRx.emptyState());
                break;
            }
            default:
                break;
        }
    }


    onSelectMember(item: ITeamMember) {
        let { adminReducer: { orgCharts } } = this.props;
        console.log("onSelectMember", item);
        if (item.teamProfiles.length === 0) {
            this.setState(previous => ({ ...previous, member: item, dropdownValue: -1 }));
        }
        else {
            let charts = orgCharts as Array<IOrgChart>;
            let chart_ids = charts.findIndex((v, i, arr) => {
                return v._id.toString() === item.teamProfiles[0].org_chart_id;
            });
            this.setState(previous => ({ ...previous, member: item, dropdownValue: chart_ids }));
        }
    }

    onSubmit() {
        let { adminReducer: { orgCharts }, teamReducer: { team } } = this.props;

        let _member = this.state.member;
        if (orgCharts.length > 0 && this.state.dropdownValue >= 0) {
            this.orgChart_id = orgCharts[this.state.dropdownValue]._id;
        }

        if (_member) {
            this.props.dispatch(adminRx.updateUserOrgChart(_member, team._id, this.orgChart_id));
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
                <Flex flexColumn align="center">
                    {
                        (!!this.state.member) ?
                            <ContactProfileView
                                member={this.state.member}
                                onSubmit={this.onSubmit}
                                dropdownItems={this.props.adminReducer.orgCharts}
                                dropdownValue={this.state.dropdownValue}
                                dropdownChange={(event, id, value) => { console.log(value); this.setState(previous => ({ ...previous, dropdownValue: value })); }}
                            />
                            :
                            <MemberList onSelected={this.onSelectMember} items={this.props.teamReducer.members} />
                    }
                </Flex>
            </Flex>
        );
    }
}