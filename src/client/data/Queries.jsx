import { gql } from 'react-apollo';
export const getChartItemsQuery = gql `query getChartItems($team_id: String) {
     charts(team_id: $team_id) {
        _id
        chart_name
        chart_description
        chart_level
        team_id
        rooms {
            name
            status
            type
            team_id
            description
            createTime
        }
    }
}`;
