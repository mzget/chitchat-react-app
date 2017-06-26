import * as React from "react";
import { lifecycle, compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { ProfileListView } from "./ProfileListView";
import * as UserRx from "../../redux/user/userRx";
const mapStateToProps = (state) => ({
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
});
const ProfileListViewEnhancer = compose(connect(mapStateToProps), lifecycle({
    componentWillMount() {
        let { teamReducer, history } = this.props;
        if (!teamReducer.team) {
            history.replace(`/`);
        }
        else {
            this.props.dispatch(UserRx.getTeamProfile(teamReducer.team._id));
        }
    }
}), withHandlers({
    onClickMyProfile: (props) => item => {
        props.history.push(`/profile/user/${item.username}`);
    }
}));
export let ProfileEnhanced = ProfileListViewEnhancer(({ userReducer, onClickMyProfile }) => (<ProfileListView item={userReducer.user} onSelected={onClickMyProfile}/>));
ProfileEnhanced = withRouter(ProfileEnhanced);
