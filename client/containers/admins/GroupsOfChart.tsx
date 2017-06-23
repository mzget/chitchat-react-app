import * as React from "react";
import { gql, graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import Subheader from "material-ui/Subheader";

import { GroupListView } from "./GroupListView";
import { Room } from "../../chitchat/chats/models/Room";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";

interface ICompProps {
    chartItem: IOrgChart;
    groups?: Array<Room>;
    onSelectItem: (item: Room) => void;
}

const GroupsOfChart = ({ data, onSelectItem }) => (
    <GroupListView items={data.groups} onSelected={onSelectItem} />
);


const MyQuery = gql`query { charts {
     _id
    chart_name
    chart_description
    chart_level
    team_id
}}`;
const withData = graphql(MyQuery, {
    options: ({ team_id }) => ({
        variables: { team_id },
    })
});
// Attach the data HoC to the pure component
const GroupsOfChartEnhanced = compose(
    withData,
    pure,
)(GroupsOfChart) as React.ComponentClass<{ team_id, onSelectItem }>;

export const GroupsPure = ({ chartItem, onSelectItem }: ICompProps) => (
    <div style={{ width: `100%` }}>
        <Subheader>{chartItem.chart_name}</Subheader>
        <GroupsOfChartEnhanced team_id={chartItem.team_id} onSelectItem={onSelectItem} />
    </div>
);