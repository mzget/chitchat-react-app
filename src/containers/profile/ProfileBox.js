"use strict";
const React = require("react");
const recompose_1 = require("recompose");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const Subheader_1 = require("material-ui/Subheader");
const ProfileListView_1 = require("./ProfileListView");
const UserRx = require("../../redux/user/userRx");
const ProfileView = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Profile"),
    React.createElement(ProfileListView_1.ProfileListView, { item: props.user, onSelected: props.onClickMyProfile })));
const mapStateToProps = (state) => ({
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
});
const enhanced = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.lifecycle({
    componentWillMount() {
        let { teamReducer, history } = this.props;
        if (!teamReducer.team) {
            history.replace(`/`);
        }
        else {
            this.props.dispatch(UserRx.getTeamProfile(teamReducer.team._id));
        }
    }
}), recompose_1.withHandlers({
    onClickMyProfile: (props) => item => {
        props.history.push(`/profile/user/${item.username}`);
    }
}));
const ProfileEnhanced = enhanced(({ userReducer, onClickMyProfile }) => React.createElement(ProfileView, { user: userReducer.user, onClickMyProfile: onClickMyProfile }));
exports.ProfileWithRouter = react_router_dom_1.withRouter(ProfileEnhanced);
