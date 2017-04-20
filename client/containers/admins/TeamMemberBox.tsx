import * as React from "react";
import { Flex, Box } from "reflexbox";
import { shallowEqual } from "recompose";

import { IComponentProps } from "../../utils/IComponentProps";

import { MemberList } from "../chatlist/MemberList";
import { ContactProfileView } from "./ContactProfileView";

import * as adminRx from "../../redux/admin/adminRx";
import * as teamRx from "../../redux/team/teamRx";

import { ITeamProfile } from "../../chitchat/chats/models/TeamProfile";
import { ITeamMember } from "../../chitchat/chats/models/ITeamMember";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";
import { UserRole } from "../../chitchat/chats/models/UserRole";

interface IComponentState {
    member: ITeamMember;
    dropdownValue: number;
    teamRoleValue: number;
}
export class TeamMemberBox extends React.Component<IComponentProps, IComponentState> {

    orgChart_id: string;
    userRole: string;
    userRoles = [
        UserRole[UserRole.personnel],
        UserRole[UserRole.section_chief],
        UserRole[UserRole.department_chief],
        UserRole[UserRole.division_chief],
        UserRole[UserRole.admin]];

    componentWillMount() {
        this.state = {
            member: null,
            dropdownValue: 0,
            teamRoleValue: 0
        };

        this.onSelectMember = this.onSelectMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { adminReducer, teamReducer } = nextProps;

        if (!shallowEqual(adminReducer, this.props.adminReducer)) {
            if (adminReducer.state == adminRx.UPDATE_USER_ORG_CHART_FAILURE) {
                this.props.onError(adminReducer.error);
            }
            else if (adminReducer.state == adminRx.UPDATE_USER_ORG_CHART_SUCCESS || adminReducer.state == adminRx.UPDATE_USER_TEAM_ROLE_SUCCESS) {
                this.setState(previous => ({ ...previous, member: null }));
                this.props.dispatch(adminRx.emptyState());

                this.props.dispatch(teamRx.getTeamMembers(teamReducer.team._id));
            }
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

            let role_id = this.userRoles.findIndex((v, i) => {
                return v == item.teamProfiles[0].team_role.toString();
            });
            this.setState(previous => ({
                ...previous,
                member: item,
                dropdownValue: chart_ids,
                teamRoleValue: role_id
            }));
        }
    }

    onSubmit() {
        let { adminReducer: { orgCharts }, teamReducer: { team } } = this.props;

        let _member = this.state.member;
        if (orgCharts.length > 0 && this.state.dropdownValue >= 0) {
            this.orgChart_id = orgCharts[this.state.dropdownValue]._id;
        }

        this.userRole = this.userRoles[this.state.teamRoleValue];

        console.log(_member, this.orgChart_id, this.userRole);

        if (_member) {
            if (this.orgChart_id)
                this.props.dispatch(adminRx.updateUserOrgChart(_member, team._id, this.orgChart_id));
            if (this.userRole) {
                let profile = { team_role: this.userRole } as ITeamProfile | any;
                this.props.dispatch(adminRx.updateUserTeamRole(_member._id, team._id, profile));
            }
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
                                dropdownChange={(event, id, value) => {
                                    console.log("org chart change", value);
                                    this.setState(previous => ({ ...previous, dropdownValue: value }));
                                }}
                                teamRoleItems={this.userRoles}
                                teamRoleValue={this.state.teamRoleValue}
                                onTeamRoleChange={(event, id, value) => {
                                    console.log("team role change", value);
                                    this.setState(prev => ({ ...prev, teamRoleValue: value }));
                                }}
                            />
                            :
                            <MemberList onSelected={this.onSelectMember} items={this.props.teamReducer.members} />
                    }
                </Flex>
            </Flex>
        );
    }
}