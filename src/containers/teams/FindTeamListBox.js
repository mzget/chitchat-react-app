import * as React from "react";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
const style = {
    margin: 4,
};
import { TeamListView } from "./TeamListView";
export const FindTeamListBox = (props) => (React.createElement("div", null,
    React.createElement(Subheader, null, "Find Team Results"),
    React.createElement(TeamListView, { items: props.findingTeams, onSelectItem: props.onSelectTeam, actionChild: React.createElement(RaisedButton, { label: "Join", primary: true, style: style }) })));
