"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const Immutable = require("immutable");
const CreateGroupView_1 = require("./CreateGroupView");
const SelectOrgChartView_1 = require("./SelectOrgChartView");
const config_1 = require("../../configs/config");
const Room_1 = require("../../../shared/models/Room");
const groupRx = require("../../redux/group/groupRx");
const privateGroupRx = require("../../redux/group/privateGroupRxActions");
exports.createOrgGroup = "create-org-group";
exports.createPjbGroup = "create-projectbase-group";
exports.createPvGroup = "create-group";
;
class CreateGroupBox extends React.Component {
    constructor() {
        super(...arguments);
        this.group = {};
        this.groupImage = null;
        this.fileReaderChange = (e, results) => {
            results.forEach(result => {
                const [progressEvent, file] = result;
                console.dir(file);
                this.groupImage = file;
                this.setState(prev => (Object.assign({}, prev, { groupImage: progressEvent.target.result })));
            });
        };
    }
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
        let { groupReducer } = nextProps;
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
                this.group.image = `${config_1.default.api.host}${groupReducer.groupImageResult.path}`;
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
            case exports.createOrgGroup:
                this.group.type = Room_1.RoomType.organizationGroup;
                this.group.org_chart_id = (orgCharts.length > 0) ? orgCharts[this.state.dropdownValue]._id : null;
                this.props.dispatch(groupRx.createOrgGroup(this.group));
                break;
            case exports.createPvGroup:
                let member = {
                    _id: user._id,
                    room_role: Room_1.MemberRole.owner,
                    username: user.username
                };
                this.group.type = Room_1.RoomType.privateGroup;
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
    getView() {
        let prop = {
            image: this.state.groupImage,
            group_name: this.state.groupName,
            onGroupNameChange: (e, text) => this.setState(previous => (Object.assign({}, previous, { groupName: text }))),
            group_description: this.state.groupDescription,
            onGroupDescriptionChange: (e, text) => this.setState(previous => (Object.assign({}, previous, { groupDescription: text }))),
            onSubmit: this.onSubmitGroup,
            disabledImage: true
        };
        let chart = {
            dropdownItems: this.props.adminReducer.orgCharts,
            dropdownValue: this.state.dropdownValue,
            dropdownChange: (event, id, value) => this.setState(previous => (Object.assign({}, previous, { dropdownValue: value })))
        };
        switch (this.props.groupType) {
            case exports.createOrgGroup:
                return CreateGroupView_1.CreateGroupView(prop)(SelectOrgChartView_1.SelectOrgChartView(chart));
            case exports.createPjbGroup:
                return CreateGroupView_1.CreateGroupView(prop)(SelectOrgChartView_1.SelectOrgChartView(chart));
            case exports.createPvGroup:
                prop.disabledImage = false;
                prop.onFileReaderChange = this.fileReaderChange;
                return CreateGroupView_1.CreateGroupView(prop)(null);
            default:
                break;
        }
    }
    ;
    render() {
        return (React.createElement("div", null,
            " ",
            this.getView()));
    }
}
const mapStateToProps = (state) => (Object.assign({}, state));
exports.default = react_redux_1.connect(mapStateToProps)(CreateGroupBox);
