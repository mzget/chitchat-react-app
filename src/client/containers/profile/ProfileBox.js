"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const ProfileListView_1 = require("./ProfileListView");
class ProfileBox extends React.Component {
    componentWillMount() {
        this.onClickMyProfile = this.onClickMyProfile.bind(this);
    }
    onClickMyProfile(item) {
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Profile"),
            React.createElement(ProfileListView_1.ProfileListView, { item: this.props.userReducer.user, onSelected: this.onClickMyProfile })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileBox;
