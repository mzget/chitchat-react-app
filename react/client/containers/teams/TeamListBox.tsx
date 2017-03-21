import * as React from "react";
import Subheader from "material-ui/Subheader"; import RaisedButton from "material-ui/RaisedButton";

const style = {
    margin: 6,
};

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
                <Subheader>Your Teams</Subheader>
                <TeamListView
                    items={this.props.teamReducer.teams}
                    onSelectItem={this.props.onSelectTeam}
                    actionChild={<RaisedButton label="Enter" primary={true} style={style} />} />
            </div>
        );
    }
}
export default TeamListBox;
