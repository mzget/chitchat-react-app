"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var recompose_1 = require("recompose");
var react_redux_1 = require("react-redux");
var Subheader_1 = require("material-ui/Subheader");
var teamRx = require("../../redux/team/teamRx");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var chatroomRx = require("../../chitchat/chats/redux/chatroom/chatroomRxEpic");
var MemberList_1 = require("../../components/MemberList");
var Contacts = (function (_super) {
    __extends(Contacts, _super);
    function Contacts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Contacts.prototype.componentDidMount = function () {
        this.onselectMember = this.onselectMember.bind(this);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    };
    Contacts.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        var chatroomReducer = nextProps.chatroomReducer, teamReducer = nextProps.teamReducer, userReducer = nextProps.userReducer;
        if (!recompose_1.shallowEqual(chatroomReducer, this.props.chatroomReducer)) {
            if (chatroomReducer.state == chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE) {
                var contacts = teamReducer.members.filter(function (v, i) {
                    return v._id === _this._tempContact_id;
                });
                var members = chatroomActions.createChatRoom(userReducer.user, contacts[0]);
                this.props.dispatch(chatroomRx.createPrivateChatRoom(members.owner, members.contact));
            }
        }
    };
    Contacts.prototype.onselectMember = function (data) {
        var _this = this;
        var userReducer = this.props.userReducer;
        this._tempContact_id = data._id;
        this.props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(function () {
            return _this.props.dispatch(chatroomRx.fetchPrivateChatRoom(userReducer.user._id, _this._tempContact_id));
        });
    };
    Contacts.prototype.render = function () {
        return (<div>
                <Subheader_1.default>Chats</Subheader_1.default>
                <MemberList_1.MemberList items={this.props.teamReducer.members} onSelected={this.onselectMember}/>
            </div>);
    };
    return Contacts;
}(React.Component));
var mapStateToProps = function (state) { return ({
    chatroomReducer: state.chatroomReducer,
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
}); };
exports.ContactBox = react_redux_1.connect(mapStateToProps)(Contacts);
