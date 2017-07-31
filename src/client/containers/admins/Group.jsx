import * as React from "react";
import { gql, graphql } from 'react-apollo';
import { compose, pure } from "recompose";
import Flexbox from "flexbox-react";
import { darkWhite } from "material-ui/styles/colors";
import { LinearProgressSimple } from "../../components/LinearProgressSimple";
import { RoomOverview, RoomHeader } from "../../components/RoomOverview";
import { EditGroupMember } from '../../components/EditGroupMember';
const GroupPureComponent = ({ data: { room, loading, error } }) => (<Flexbox justifyContent="center" minWidth="400px" style={{ height: "100%", overflowY: "scroll", backgroundColor: darkWhite }}>
        {(loading || error)
    ? <LinearProgressSimple />
    : (<div>
                        <RoomHeader room={room}/>
                        <RoomOverview room={room}/>
                        <EditGroupMember members={room.members}/>
                    </div>)}
    </Flexbox>);
const getGroupItem = gql `
  query getGroupItem($id : String!) {
            room(id: $id) {
            _id
    name
        status
    type
    team_id
    description
    createTime
    members {
            _id
      room_role
        user_role
      username
      avatar
      joinTime
      status
    }
  }
}
`;
const withData = graphql(getGroupItem, {
    options: ({ id }) => ({
        variables: { id }
    })
});
const GroupPureWithData = compose(withData, pure)(GroupPureComponent);
export const GroupPureEnhanced = ({ room_id }) => (<div style={{ width: `100%` }}>
        <GroupPureWithData id={room_id}/>
    </div>);
