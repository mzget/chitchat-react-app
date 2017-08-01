import * as React from "react";
import { pure, compose, lifecycle } from "recompose";
import { connect } from "react-redux";

import { ChatTabs } from "../../components/ChatTabs";



// Do this instead
// Note that the order has reversed — props flow from top to bottom
const enhance = compose(
    connect((state) => ({ logCount: state.chatlogReducer.get("logCount") })),
    pure
);

export const ChatTabsEnhanced = enhance(({ groupComp, chatlogs, logCount }) => <ChatTabs
    groupComp={groupComp}
    chatlogs={chatlogs}
    logCount={logCount}
/>) as React.ComponentClass<{ groupComp, chatlogs }>;