import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../../utils/IComponentProps";
import { CreateGroupView } from "./CreateGroupView";
import { SelectOrgChartView } from "./SelectOrgChartView";

import { Room, RoomType, RoomStatus } from "../../../server/scripts/models/Room";
import { IOrgChart } from "../../../server/scripts/models/OrgChart";

import * as groupRx from "../../redux/group/groupRx";

export const createOrgGroup: string = "create-org-group";
export const createPjbGroup: string = "create-projectbase-group";
export const createPvGroup: string = "create-group";

interface IProps extends IComponentProps {
    groupType: string;
}
interface IComponentNameState {
    groupImage: string;
    groupName: string;
    groupDescription: string;

    dropdownValue: number;
};

class CreateGroupBox extends React.Component<IProps, IComponentNameState> {

    group = {} as Room;

    componentWillMount() {
        this.state = {
            groupImage: "",
            groupName: "",
            groupDescription: "",

            dropdownValue: 0
        };

        this.getView = this.getView.bind(this);
        this.onSubmitGroup = this.onSubmitGroup.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
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
            this.group.org_chart_id = (orgCharts.length > 0) ? orgCharts[this.state.dropdownValue]._id : null;

            this.props.dispatch(groupRx.createGroup(this.group));
        }
        else {
            this.props.onError("Missing some require field");
        }
    }

    onDropDownChange(event, id, value) {
        this.setState(previous => ({ ...previous, dropdownValue: value }));
    }

    getView() {
        let prop = {
            image: this.state.groupImage,
            group_name: this.state.groupName,
            onGroupNameChange: (e, text) => this.setState(previous => ({ ...previous, groupName: text })),
            group_description: this.state.groupDescription,
            onGroupDescriptionChange: (e, text) => this.setState(previous => ({ ...previous, groupDescription: text })),
            onSubmit: this.onSubmitGroup
        };
        let chart = {
            dropdownItems: this.props.adminReducer.orgCharts,
            dropdownValue: this.state.dropdownValue,
            dropdownChange: this.onDropDownChange
        };

        switch (this.props.groupType) {
            case createOrgGroup:
                return CreateGroupView(prop)(SelectOrgChartView(chart));
            case createPjbGroup:
                return CreateGroupView(prop)(SelectOrgChartView(chart));
            case createPvGroup:
                return CreateGroupView(prop);
            default:
                break;
        }
    };

    public render(): JSX.Element {
        return (
            <div>
                {
                    this.getView()
                }
            </div>
        );
    }
}

export default CreateGroupBox;