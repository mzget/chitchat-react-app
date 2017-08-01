import * as React from "react";
import { pure, compose } from "recompose";
import { ChatTabs } from "../../components/ChatTabs";
const enhance = compose(pure);
export const ChatTabsEnhanced = enhance(({ groupComp, chatlogs, logCount }) => <ChatTabs groupComp={groupComp} chatlogs={chatlogs} logCount={logCount}/>);
