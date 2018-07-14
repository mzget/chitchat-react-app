import * as React from "react";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
import { TeamListView } from "./TeamListView";
const style = {
    margin: 6,
};
class IComponentNameProps {
}
export const TeamListBox = (props) => (<div>
        <Subheader>You're already to join this team:</Subheader>
        <TeamListView items={props.teams} onSelectItem={props.onSelectTeam} actionChild={<RaisedButton label="Enter" primary={true} style={style}/>}/>
    </div>);
