import * as React from "react";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";

const style = {
    margin: 6,
};

import { TeamListView } from './TeamListView';
import { ITeam } from '../../../server/scripts/models/ITeam';

interface IComponentNameProps {
    findingTeams: Array<ITeam>;
    onSelectTeam: (team: ITeam) => void;
};

export const FindTeamListBox = (props: IComponentNameProps) => (
    <div>
        <Subheader>Find Team Results</Subheader>
        <TeamListView
            items={props.findingTeams}
            onSelectItem={props.onSelectTeam}
            actionChild={<RaisedButton label="Join" primary={true} style={style} />}
            />
    </div>
);
