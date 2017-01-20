import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../../utils/IComponentProps";

import { TeamListView } from './TeamListView';

abstract class IComponentNameProps implements IComponentProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
            agent_name: string;
        }
    };
    params;
    router;
    dispatch;
    authReducer;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
    teamReducer;
};

interface IComponentNameState { };

class TeamListBox extends React.Component<IComponentNameProps, IComponentNameState> {

    componentWillMount() {
        console.log("TeamList", this.props.teamReducer.teams);

        this.onSelectTeam = this.onSelectTeam.bind(this);
    }

    onSelectTeam(teamId: string) {
        console.log("onSelected team", teamId);
    }

    public render(): JSX.Element {
        return (
            <div>
                <TeamListView items={this.props.teamReducer.teams} onSelectItem={this.onSelectTeam} />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}
export default connect(mapStateToProps)(TeamListBox);
