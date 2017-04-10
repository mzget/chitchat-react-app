import * as React from "react";
import { pure, lifecycle, compose, withHandlers } from "recompose";
import { connect } from "react-redux";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";
import { ProfileListView } from "./ProfileListView";

import * as UserRx from "../../redux/user/userRx";

interface IEnhancerProps {
    dispatch;
    teamReducer;
    userReducer;
    router;
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
            console.log("click", item);
            props.router.push("/team/profile/:user");
        }
    }),
    pure
);

const ProfileView = (props: { user, onClickMyProfile: (item) => void }) => (
    <div>
        <Subheader>Profile</Subheader>
        <ProfileListView item={props.user} onSelected={props.onClickMyProfile} />
    </div>
);
export const ProfileEnhancer = enhanced(({ teamReducer, userReducer, onClickMyProfile }: IEnhancerProps) =>
    <ProfileView
        user={userReducer.user}
        onClickMyProfile={onClickMyProfile}
    />
) as React.ComponentClass<{ router }>;