import * as React from "react";
import { connect } from "react-redux";
import { GroupListView } from "./GroupListView";
import { GroupListEnhancer } from "./GroupListEnhancer";
const bobo = GroupListEnhancer(({ groups, fetchGroup, onselectGroup, subHeader }) => <GroupListView groups={groups} onselectGroup={onselectGroup} subHeader={subHeader}/>);
export const ConnectGroupListEnhancer = connect()(bobo);
