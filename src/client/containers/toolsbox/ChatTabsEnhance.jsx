import * as React from "react";
import { pure, compose } from "recompose";
import { connect } from "react-redux";
import { ChatTabs } from "../../components/ChatTabs";
const enhance = compose(connect((state) => ({ logCount: state.chatlogReducer.get("logCount") })), pure);
export const ChatTabsEnhanced = enhance(({ groupComp, chatlogs, logCount }) => <ChatTabs groupComp={groupComp} chatlogs={chatlogs} logCount={logCount}/>);
