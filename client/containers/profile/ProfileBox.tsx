import * as React from "react";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../../utils/IComponentProps";
import { ProfileListView } from "./ProfileListView";

interface IComponentState {

}

class ProfileBox extends React.Component<IComponentProps, IComponentState> {

    componentWillMount() {
        this.onClickMyProfile = this.onClickMyProfile.bind(this);
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