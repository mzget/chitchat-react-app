import * as React from "react";
import Subheader from "material-ui/Subheader";
import { GroupListView } from "./GroupListView";
export const GroupsOfChart = (props) => (React.createElement("div", { style: { width: `100%` } },
    React.createElement(Subheader, null, props.chartItem.chart_name),
    React.createElement(GroupListView, { items: props.groups, onSelected: props.onSelectItem })));
