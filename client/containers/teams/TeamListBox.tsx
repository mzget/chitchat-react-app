import * as React from "react";

import { TeamListView } from './TeamListView';
import { ITeam } from '../../../server/scripts/models/ITeam';

abstract class IComponentNameProps {
    teamReducer;
    onSelectTeam: (team: ITeam) => void;
};

interface IComponentNameState { };

class TeamListBox extends React.Component<IComponentNameProps, IComponentNameState> {

    componentWillMount() {
        console.log("TeamList", this.props.teamReducer.teams);
    }

    public render(): JSX.Element {
        return (
            <div>
                <TeamListView items={this.props.teamReducer.teams} onSelectItem={this.props.onSelectTeam} />
            </div>
        );
    }
}
export default TeamListBox;
