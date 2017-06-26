import * as React from "react";
import Flexbox from "flexbox-react";
import { Card, CardTitle } from "material-ui";
import { gql, graphql } from 'react-apollo';
import { compose, pure, withHandlers, withProps } from "recompose";
import { TeamRoleListItem } from "../../components/TeamRoleListItem";
import { LinearProgressSimple } from "../../components/LinearProgressSimple";
const TeamRole = ({ data: { teamRoles, loading, error }, onSelectItem }) => (<div>
        {(loading || error)
    ? <LinearProgressSimple />
    : <TeamRoleListItem items={teamRoles} onSelected={onSelectItem}/>}
    </div>);
const getTeamRoles = gql `
  query getTeamRoles {
    teamRoles {
        _id
        name
    }
  }
`;
const withData = graphql(getTeamRoles);
const TeamRoleWithData = compose(withData, pure)(TeamRole);
const TeamRoleEnhancer = compose(withProps({}), withHandlers({
    onSelectItem: (props) => (item) => {
        props.history.push(`/admin/role/${item.name}`);
    }
}), pure);
export const TeamRoleEnhanced = TeamRoleEnhancer(({ history, onSelectItem }) => (<Flexbox minWidth={"400px"} justifyContent={"center"}>
        <Flexbox flexDirection="column" minWidth="400px">
            <Card>
                <CardTitle title="Team Roles"/>
            </Card>
            <TeamRoleWithData onSelectItem={onSelectItem}/>
        </Flexbox>
    </Flexbox>));
