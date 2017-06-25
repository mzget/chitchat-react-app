import * as React from "react";
import { connect } from "react-redux";
import * as Immutable from "immutable";
import { darkWhite } from "material-ui/styles/colors";

import { IComponentProps } from "../../utils/IComponentProps";
import { CreateGroupView } from "./CreateGroupView";
import { SelectOrgChartView } from "./SelectOrgChartView";

import { ChitChatFactory } from "../../chitchat/chats/ChitchatFactory";
const config = () => ChitChatFactory.getInstance().config;

import { Room, RoomType, RoomStatus, IMember, MemberRole } from "../../chitchat/chats/models/Room";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";

import * as groupRx from "../../redux/group/groupRx";
import * as privateGroupRx from "../../redux/group/privateGroupRxActions";

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
}

class CreateGroupBox extends React.Component<IProps, IComponentNameState> {

    group = {} as Room;
    groupImage = null as any;

    componentWillMount() {
        this.state = {
            groupImage: "",
            groupName: "",
            groupDescription: "",

            dropdownValue: 0
        };

        this.getView = this.getView.bind(this);
        this.onSubmitGroup = this.onSubmitGroup.bind(this);
        this.fileReaderChange = this.fileReaderChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { groupReducer } = nextProps as IComponentProps;

        if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_FAILURE) {
            let prev = Immutable.fromJS(this.props.groupReducer);
            let next = Immutable.fromJS(groupReducer);
            if (!next.equals(prev)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_SUCCESS) {
            let prev = Immutable.fromJS(this.props.groupReducer);
            let next = Immutable.fromJS(groupReducer);
            if (!next.equals(prev)) {
                this.groupImage = null;
                this.group.image = `${config().api.host}${groupReducer.groupImageResult.path}`;
                this.submit();
            }
        }
    }
    submit() {
        const { teamReducer, adminReducer: { orgCharts }, userReducer: { user } } = this.props;

        this.group.name = this.state.groupName;
        this.group.description = this.state.groupDescription;
        this.group.team_id = teamReducer.team._id;

        switch (this.props.groupType) {
            case createOrgGroup:
                this.group.type = RoomType.organizationGroup;
                this.group.org_chart_id = (orgCharts.length > 0) ? orgCharts[this.state.dropdownValue]._id : null;

                this.props.dispatch(groupRx.createOrgGroup(this.group));
                break;
            case createPvGroup:
                let member = {
                    _id: user._id,
                    room_role: MemberRole.owner,
                    username: user.username
                } as IMember;
                this.group.type = RoomType.privateGroup;
                this.group.members = new Array(member);

                this.props.dispatch(privateGroupRx.createPrivateGroup(this.group));

                break;
            default:
                console.warn("cannot submit create group...");
                break;
        }
    }
    onSubmitGroup() {
        console.log("submit group", this.state);

        if (this.state.groupName.length > 0 && !this.groupImage) {
            this.submit();
        }
        else if (this.state.groupName.length > 0 && !!this.groupImage) {
            // @Todo upload group image first...
            this.props.dispatch(groupRx.uploadGroupImage(this.groupImage));
        }
        else {
            this.props.onError("Missing some require field");
        }
    }
    fileReaderChange = (e, results) => {
        results.forEach(result => {
            const [progressEvent, file] = result;

            console.dir(file);
            this.groupImage = file;
            this.setState(prev => ({ ...prev, groupImage: progressEvent.target.result }));
        });
    }

    getView() {
        let prop = {
            image: this.state.groupImage,
            group_name: this.state.groupName,
            onGroupNameChange: (e, text) => this.setState(previous => ({ ...previous, groupName: text })),
            group_description: this.state.groupDescription,
            onGroupDescriptionChange: (e, text) => this.setState(previous => ({ ...previous, groupDescription: text })),
            onSubmit: this.onSubmitGroup,
            disabledImage: true
        };
        let chart = {
            dropdownItems: this.props.adminReducer.orgCharts,
            dropdownValue: this.state.dropdownValue,
            dropdownChange: (event, id, value) => this.setState(previous => ({ ...previous, dropdownValue: value }))
        };

        switch (this.props.groupType) {
            case createOrgGroup:
                return CreateGroupView(prop)(SelectOrgChartView(chart));
            case createPjbGroup:
                return CreateGroupView(prop)(SelectOrgChartView(chart));
            case createPvGroup:
                prop.disabledImage = false;
                prop.onFileReaderChange = this.fileReaderChange;
                return CreateGroupView(prop)(null);
            default:
                break;
        }
    }

    public render(): JSX.Element {
        return (
            <div style={{ backgroundColor: darkWhite, width: "100%" }}> {
                this.getView()
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(CreateGroupBox) as React.ComponentClass<IProps>;