import * as React from "react";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
const style = {
    margin: 6,
};
import { TeamListView } from "./TeamListView";
class IComponentNameProps {
}
export const TeamListBox = (props) => (React.createElement("div", null,
    React.createElement(Subheader, null, "Your Teams"),
    React.createElement(TeamListView, { items: props.teams, onSelectItem: props.onSelectTeam, actionChild: React.createElement(RaisedButton, { label: "Enter", primary: true, style: style }) })));
