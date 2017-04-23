import * as React from "react";
import { pure, lifecycle, compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";
import { ProfileListView } from "./ProfileListView";

import * as UserRx from "../../redux/user/userRx";

const ProfileView = (props: { user, onClickMyProfile: (item) => void }) => (
    <div>
        <Subheader>Profile</Subheader>
        <ProfileListView item={props.user} onSelected={props.onClickMyProfile} />
    </div>
);

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

const enhanced = compose(
    connect(mapStateToProps),
    lifecycle({
        componentWillMount() {
            this.props.dispatch(UserRx.getTeamProfile(this.props.teamReducer.team._id));
        }
    }),
    withHandlers({
        onClickMyProfile: (props: IEnhancerProps) => item => {
            props.history.push(`/profile/user/${item.username}`);
        }
    })
);
const ProfileEnhanced = enhanced(({ userReducer, onClickMyProfile }: IEnhancerProps) =>
    <ProfileView
        user={userReducer.user}
        onClickMyProfile={onClickMyProfile}
    />
) as React.ComponentClass<any>;

export const ProfileWithRouter = withRouter(ProfileEnhanced);