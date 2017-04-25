"use strict";
const React = require("react");
const recompose_1 = require("recompose");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const ProfileListView_1 = require("./ProfileListView");
const UserRx = require("../../redux/user/userRx");
const mapStateToProps = (state) => ({
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
});
const ProfileListViewEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.lifecycle({
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
exports.ProfileEnhanced = ProfileListViewEnhancer(({ userReducer, onClickMyProfile }) => (React.createElement(ProfileListView_1.ProfileListView, { item: userReducer.user, onSelected: onClickMyProfile })));
exports.ProfileEnhanced = react_router_dom_1.withRouter(exports.ProfileEnhanced);
