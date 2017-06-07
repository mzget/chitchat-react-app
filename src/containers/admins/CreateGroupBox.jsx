"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_redux_1 = require("react-redux");
var Immutable = require("immutable");
var CreateGroupView_1 = require("./CreateGroupView");
var SelectOrgChartView_1 = require("./SelectOrgChartView");
var ChitchatFactory_1 = require("../../chitchat/chats/ChitchatFactory");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var Room_1 = require("../../chitchat/shared/Room");
var groupRx = require("../../redux/group/groupRx");
var privateGroupRx = require("../../redux/group/privateGroupRxActions");
exports.createOrgGroup = "create-org-group";
exports.createPjbGroup = "create-projectbase-group";
exports.createPvGroup = "create-group";
var CreateGroupBox = (function (_super) {
    __extends(CreateGroupBox, _super);
    function CreateGroupBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.group = {};
        _this.groupImage = null;
        _this.fileReaderChange = function (e, results) {
            results.forEach(function (result) {
                var progressEvent = result[0], file = result[1];
                console.dir(file);
                _this.groupImage = file;
                _this.setState(function (prev) { return (__assign({}, prev, { groupImage: progressEvent.target.result })); });
            });
        };
        return _this;
    }
    CreateGroupBox.prototype.componentWillMount = function () {
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
    };
    CreateGroupBox.prototype.componentWillReceiveProps = function (nextProps) {
        var groupReducer = nextProps.groupReducer;
        if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_FAILURE) {
            var prev = Immutable.fromJS(this.props.groupReducer);
            var next = Immutable.fromJS(groupReducer);
            if (!next.equals(prev)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_SUCCESS) {
            var prev = Immutable.fromJS(this.props.groupReducer);
            var next = Immutable.fromJS(groupReducer);
            if (!next.equals(prev)) {
                this.groupImage = null;
                this.group.image = "" + config().api.host + groupReducer.groupImageResult.path;
                this.submit();
            }
        }
    };
    CreateGroupBox.prototype.submit = function () {
        var _a = this.props, teamReducer = _a.teamReducer, orgCharts = _a.adminReducer.orgCharts, user = _a.userReducer.user;
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
                var member = {
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
    };
    CreateGroupBox.prototype.onSubmitGroup = function () {
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
    };
    CreateGroupBox.prototype.getView = function () {
        var _this = this;
        var prop = {
            image: this.state.groupImage,
            group_name: this.state.groupName,
            onGroupNameChange: function (e, text) { return _this.setState(function (previous) { return (__assign({}, previous, { groupName: text })); }); },
            group_description: this.state.groupDescription,
            onGroupDescriptionChange: function (e, text) { return _this.setState(function (previous) { return (__assign({}, previous, { groupDescription: text })); }); },
            onSubmit: this.onSubmitGroup,
            disabledImage: true
        };
        var chart = {
            dropdownItems: this.props.adminReducer.orgCharts,
            dropdownValue: this.state.dropdownValue,
            dropdownChange: function (event, id, value) { return _this.setState(function (previous) { return (__assign({}, previous, { dropdownValue: value })); }); }
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
    };
    CreateGroupBox.prototype.render = function () {
        return (<div> {this.getView()}
            </div>);
    };
    return CreateGroupBox;
}(React.Component));
var mapStateToProps = function (state) { return (__assign({}, state)); };
exports.__esModule = true;
exports["default"] = react_redux_1.connect(mapStateToProps)(CreateGroupBox);
