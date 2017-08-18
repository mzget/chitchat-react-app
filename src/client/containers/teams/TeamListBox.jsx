import * as React from "react";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
const style = {
    margin: 6,
};
import { TeamListView } from "./TeamListView";
class IComponentNameProps {
}
export const TeamListBox = (props) => (<div>
        <Subheader>You're already to join this team:</Subheader>
        <TeamListView items={props.teams} onSelectItem={props.onSelectTeam} actionChild={<RaisedButton label="Enter" primary={true} style={style}/>}/>
    </div>);
