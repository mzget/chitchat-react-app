import * as React from "react";
import Flexbox from "flexbox-react";
import { Card, CardTitle, RaisedButton } from "material-ui";
import { gql, graphql } from 'react-apollo';
import { compose, pure } from "recompose";

import { TeamListPure } from "../../components/TeamListPure";
import { LinearProgressSimple } from "../../components/LinearProgressSimple";
import { IOrgChart, OrgLevel } from "../../chitchat/chats/models/OrgChart";

interface ICompProps {
    // onCreateNew: () => void;
    onSelectItem: (item: any) => void;
}

const TeamRole = ({ data: { teamRoles, loading, error }, onSelectItem }) => (
    <div>
        {
            (loading || error)
                ? <LinearProgressSimple />
                : <TeamListPure items={teamRoles} onSelected={onSelectItem} />
        }
    </div>
);

const getTeamRoles = gql`
  query getTeamRoles {
    teamRoles {
        _id
        name
    }
  }
`;

const withData = graphql(getTeamRoles);
const TeamRoleWithData = compose(
    withData,
    pure
)(TeamRole) as React.ComponentClass<{ onSelectItem }>;

export const TeamRoleEnhanced = ({ onSelectItem }) => (
    <Flexbox minWidth={"400px"} justifyContent={"center"}>
        <Flexbox flexDirection="column" minWidth="400px">
            <Card>
                <CardTitle title="Team Roles" />
            </Card>
            <TeamRoleWithData onSelectItem={onSelectItem} />
        </Flexbox>
    </Flexbox>
);
