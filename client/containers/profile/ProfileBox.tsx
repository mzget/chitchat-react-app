import * as React from "react";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";
import { ProfileListView } from "./ProfileListView";

import * as UserRx from "../../redux/user/userRx";

interface IComponentState {

}

class ProfileBox extends React.Component<IComponentProps, IComponentState> {

    componentWillMount() {
        this.onClickMyProfile = this.onClickMyProfile.bind(this);

        this.props.dispatch(UserRx.getTeamProfile(this.props.teamReducer.team._id));
    }


    onClickMyProfile(item) {

    }

    render() {
        return (
            <div>
                <Subheader>Profile</Subheader>
                <ProfileListView item={this.props.userReducer.user} onSelected={this.onClickMyProfile} />
            </div>
        );
    }
}

export default ProfileBox;