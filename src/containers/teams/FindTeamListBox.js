import * as React from "react";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
import { TeamListView } from "./TeamListView";
const style = {
    margin: 4,
};
export const FindTeamListBox = (props) => (<div>
        <Subheader>Find Team Results</Subheader>
        <TeamListView items={props.findingTeams} onSelectItem={props.onSelectTeam} actionChild={<RaisedButton label="Join" primary={true} style={style}/>}/>
    </div>);
