import * as React from "react";
import { RoomOverview } from "../../components/RoomOverview";
import { EditGroupMemberEnhanced } from "../roomSettings/EditGroupMemberEnhanced";
export const GroupPureComponent = ({ room }) => (<div>
        {(!!room)
    ? <RoomOverview room={room}/>
    : null}
        <EditGroupMemberEnhanced members={room.members} room_id={room._id}/>
    </div>);
