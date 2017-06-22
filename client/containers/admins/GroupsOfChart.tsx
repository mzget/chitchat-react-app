import * as React from "react";
import Subheader from "material-ui/Subheader";

import { GroupListView } from "./GroupListView";
import { Room } from "../../chitchat/chats/models/Room";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";

interface ICompProps {
    chartItem: IOrgChart;
    groups: Array<Room>;
    onSelectItem: (item: Room) => void;
}

export const GroupsOfChart = (props: ICompProps) => (
    <div style={{ width: `100%` }}>
        <Subheader>{props.chartItem.chart_name}</Subheader>
        <GroupListView items={props.groups} onSelected={props.onSelectItem} />
    </div>
);