import * as React from "react";
import { gql, graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import Subheader from "material-ui/Subheader";
import { GroupListView } from "./GroupListView";
const GroupsOfChart = ({ data, onSelectItem }) => (React.createElement(GroupListView, { items: data.groups, onSelected: onSelectItem }));
const MyQuery = gql `query getChartItems($team_id: String) {
     charts(team_id: $team_id) {
        _id
        chart_name
        chart_description
        chart_level
        team_id
    }
}`;
const withData = graphql(MyQuery, {
    options: ({ team_id }) => ({
        variables: { team_id },
    })
});
// Attach the data HoC to the pure component
const GroupsOfChartEnhanced = compose(withData, pure)(GroupsOfChart);
export const GroupsPure = ({ chartItem, onSelectItem }) => (React.createElement("div", { style: { width: `100%` } },
    React.createElement(Subheader, null, chartItem.chart_name),
    React.createElement(GroupsOfChartEnhanced, { team_id: chartItem.team_id, onSelectItem: onSelectItem })));
