import * as React from "react";
import { connect } from "react-redux";

import { GroupListView } from "./GroupListView";
import { GroupListEnhancer } from "./GroupListEnhancer";

const GroupListEnhaced = GroupListEnhancer(({ groups, fetchGroup, onselectGroup, subHeader }: any) =>
    <GroupListView
        groups={groups}
        onselectGroup={onselectGroup}
        subHeader={subHeader} />
) as React.ComponentClass<any>;

export const ConnectGroupListEnhancer = connect()(GroupListEnhaced);




