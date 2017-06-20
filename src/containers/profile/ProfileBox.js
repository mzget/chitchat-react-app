"use strict";
exports.__esModule = true;
var React = require("react");
var recompose_1 = require("recompose");
var react_router_dom_1 = require("react-router-dom");
var react_redux_1 = require("react-redux");
var ProfileListView_1 = require("./ProfileListView");
var UserRx = require("../../redux/user/userRx");
var mapStateToProps = function (state) { return ({
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
}); };
var ProfileListViewEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.lifecycle({
    componentWillMount: function () {
        var _a = this.props, teamReducer = _a.teamReducer, history = _a.history;
        if (!teamReducer.team) {
            history.replace("/");
        }
        else {
            this.props.dispatch(UserRx.getTeamProfile(teamReducer.team._id));
        }
    }
}), recompose_1.withHandlers({
    onClickMyProfile: function (props) { return function (item) {
        props.history.push("/profile/user/" + item.username);
    }; }
}));
exports.ProfileEnhanced = ProfileListViewEnhancer(function (_a) {
    var userReducer = _a.userReducer, onClickMyProfile = _a.onClickMyProfile;
    return (React.createElement(ProfileListView_1.ProfileListView, { item: userReducer.user, onSelected: onClickMyProfile }));
});
exports.ProfileEnhanced = react_router_dom_1.withRouter(exports.ProfileEnhanced);
