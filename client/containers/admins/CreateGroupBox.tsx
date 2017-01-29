import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../../utils/IComponentProps";
import { CreateGroupForm } from "./CreateGroupForm";

import { Room, RoomType, RoomStatus } from "../../../server/scripts/models/Room";
import { IOrgChart } from "../../../server/scripts/models/OrgChart";

abstract class IComponentNameProps implements IComponentProps {
    onError?: (error: string) => void;
    location;
    params;
    router;
    dispatch;
    routing;
    authReducer;
    adminReducer;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
    teamReducer;
    groupReducer;
};

interface IComponentNameState {
    groupImage: string;
    groupName: string;
    groupDescription: string;

    dropdownValue: number;
};

class CreateGroupBox extends React.Component<IComponentNameProps, IComponentNameState> {

    group = {} as Room;

    componentWillMount() {
        this.state = {
            groupImage: "",
            groupName: "",
            groupDescription: "",

            dropdownValue: 0
        };

        this.onSubmitGroup = this.onSubmitGroup.bind(this);
    }

    onSubmitGroup() {
        console.log("submit group", this.state);
        const {teamReducer, adminReducer: {orgCharts} } = this.props;

        if (this.state.groupName.length > 0) {
            this.group.name = this.state.groupName;
            this.group.image = this.state.groupImage;
            this.group.description = this.state.groupDescription;
            this.group.type = RoomType.organizationGroup;
            this.group.team_id = teamReducer.team._id;
            this.group.nodeId = orgCharts[this.state.dropdownValue]._id;

            console.log(this.group);

        }
        else {
            this.props.onError("Missing some require field");
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <CreateGroupForm
                    image={this.state.groupImage}
                    group_name={this.state.groupName} onGroupNameChange={(e, text) => {
                        this.setState(previous => ({ ...previous, groupName: text }));
                    } }
                    group_description={this.state.groupDescription} onGroupDescriptionChange={(e, text) => {
                        this.setState(previous => ({ ...previous, groupDescription: text }));
                    } }
                    dropdownItems={this.props.adminReducer.orgCharts}
                    dropdownValue={this.state.dropdownValue}
                    dropdownChange={(event, id, value) => { this.setState(previous => ({ ...previous, dropdownValue: value })) } }
                    onSubmit={this.onSubmitGroup}
                    />
            </div>
        );
    }
}

export default connect()(CreateGroupBox);
