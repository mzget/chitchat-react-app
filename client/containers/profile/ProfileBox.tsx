import * as React from "react";
import { pure, lifecycle, compose, withHandlers, ComponentEnhancer } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as Color from "material-ui/styles/colors";

import { IComponentProps } from "../../utils/IComponentProps";
import { ProfileListView } from "./ProfileListView";

import * as UserRx from "../../redux/user/userRx";

interface IEnhancerProps {
    dispatch;
    teamReducer;
    userReducer;
    history;
    onClickMyProfile: (item) => void;
}

const mapStateToProps = (state) => ({
    teamReducer: state.teamReducer,
    userReducer: state.userReducer
});

const ProfileListViewEnhancer = compose(
    connect(mapStateToProps),
    lifecycle({
        componentWillMount() {
            let { teamReducer, history } = this.props;
            if (!teamReducer.team) {
                history.replace(`/`);
            }
            else {
                this.props.dispatch(UserRx.getTeamProfile(teamReducer.team._id));
            }
        }
    }),
    withHandlers({
        onClickMyProfile: (props: IEnhancerProps) => item => {
            props.history.push(`/profile/user/${item.username}`);
        }
    })
);
export let ProfileEnhanced = ProfileListViewEnhancer(({ userReducer, onClickMyProfile }) => (
    <ProfileListView item={userReducer.user} onSelected={onClickMyProfile} styles={{ color: Color.darkWhite }} />
)) as React.ComponentClass<any>;

ProfileEnhanced = withRouter(ProfileEnhanced);