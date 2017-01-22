import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../../utils/IComponentProps";

import * as userRx from "../../redux/user/userRx";
import * as teamRx from "../../redux/team/teamRx";

interface IComponentNameState { };

class ChatListBox extends React.Component<IComponentProps, IComponentNameState> {

    componentWillMount() {
        console.log("ChatList", this.props);

        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }


    public render(): JSX.Element {
        return (
            <div>
            </div>);
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({
    ...state
});
export default connect(mapStateToProps)(ChatListBox);
