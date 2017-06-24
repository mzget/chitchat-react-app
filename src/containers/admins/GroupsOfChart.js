import * as React from "react";
import { gql, graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import Subheader from "material-ui/Subheader";
import { GroupListView } from "./GroupListView";
const GroupsOfChart = ({ data, onSelectItem }) => {
    return (data.loading) ? null : React.createElement(GroupListView, { items: data.chart.rooms, onSelected: onSelectItem });
};
const getChartItemQuery = gql `query getChartItem($id: String!) {
     chart(id: $id) {
        _id
        chart_name
        chart_description
        chart_level
        team_id
        rooms {
            _id
            name
            status
            type
            team_id
            description
            createTime
        }
    }
}`;
const withData = graphql(getChartItemQuery, {
    options: ({ id }) => ({
        variables: { id },
    })
});
// Attach the data HoC to the pure component
const GroupsOfChartEnhanced = compose(withData, pure)(GroupsOfChart);
export const GroupsPure = ({ chartItem, onSelectItem }) => (React.createElement("div", { style: { width: `100%` } },
    React.createElement(Subheader, null, chartItem.chart_name),
    React.createElement(GroupsOfChartEnhanced, { id: chartItem._id, onSelectItem: onSelectItem })));
