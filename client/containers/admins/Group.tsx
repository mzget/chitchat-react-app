import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import { RoomOverview, RoomHeader } from "../../components/RoomOverview";
import { EditGroupMemberEnhanced } from "../roomSettings/EditGroupMemberEnhanced";

import { Room } from "../../chitchat/chats/models/Room";

export const GroupPureComponent = ({ room }) => (
    <div>
        {
            (!!room)
                ? <RoomOverview room={room} />
                : null
        }
        <EditGroupMemberEnhanced members={room.members} room_id={room._id} />
    </div>
);