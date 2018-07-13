import * as React from "react";

import { ContactBox } from "./chatlist/ContactBox";
import { ChatRoomOverviewEnhanced } from "./ChatRoomOverview";

const getView = (match, onError) => {
    if (match.path.match("/chatroom/")) {
        return <ChatRoomOverviewEnhanced onError={onError} />
    }
    else {
        return <ContactBox />;
    }
};

export const RightNav = ({ match, onError }) => (
    <div>
        {
            getView(match, onError)
        }
    </div>
);