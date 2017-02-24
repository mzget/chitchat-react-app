"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const ProfileListView_1 = require("./ProfileListView");
const UserRx = require("../../redux/user/userRx");
class ProfileBox extends React.Component {
    componentWillMount() {
        this.onClickMyProfile = this.onClickMyProfile.bind(this);
        this.props.dispatch(UserRx.getTeamProfile(this.props.teamReducer.team._id));
    }
    onClickMyProfile(item) {
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Profile"),
            React.createElement(ProfileListView_1.ProfileListView, { item: this.props.userReducer.user, onSelected: this.onClickMyProfile })));
    }
}
exports.default = ProfileBox;
