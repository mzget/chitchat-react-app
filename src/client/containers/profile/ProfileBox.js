"use strict";
const React = require("react");
const recompose_1 = require("recompose");
const react_redux_1 = require("react-redux");
const Subheader_1 = require("material-ui/Subheader");
const ProfileListView_1 = require("./ProfileListView");
const UserRx = require("../../redux/user/userRx");
const enhanced = recompose_1.compose(recompose_1.lifecycle({
    componentWillMount() {
        this.props.dispatch(UserRx.getTeamProfile(this.props.teamReducer.team._id));
    }
}), recompose_1.withHandlers({
    onClickMyProfile: (props) => item => {
        console.log("click", item);
        props.router.push("/team/profile/:user");
    }
}), recompose_1.pure);
const ProfileView = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Profile"),
    React.createElement(ProfileListView_1.ProfileListView, { item: props.user, onSelected: props.onClickMyProfile })));
const EnhancerProfile = enhanced(({ teamReducer, userReducer, onClickMyProfile }) => React.createElement(ProfileView, { user: userReducer.user, onClickMyProfile: onClickMyProfile }));
const mapStateToProps = (state) => ({
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
});
exports.ConnectProfileEnhancer = react_redux_1.connect(mapStateToProps)(EnhancerProfile);
