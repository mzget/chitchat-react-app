import * as React from "react";
import { connect } from "react-redux";

import { OrgGroupListView } from "./OrgGroupListView";
import { GroupListEnhancer } from "./GroupListEnhancer";

const bobo = GroupListEnhancer(({ groupReducer, fetchGroup, onselectGroup }) =>
    <OrgGroupListView orgGroups={groupReducer.orgGroups} onselectGroup={onselectGroup} />
);

const mapStateToProps = (state) => ({ groupReducer: state.groupReducer });
export const ConnectGroupListEnhancer = connect(mapStateToProps)(bobo);




