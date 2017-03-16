import * as React from "react";
import Subheader from "material-ui/Subheader";

import { GroupList } from "./GroupList";

export const OrgGroupListView = (props: { orgGroups, onselectGroup }) => (
    <div>
        <Subheader>Org-Group</Subheader>
        <GroupList values={props.orgGroups}
            onSelected={props.onselectGroup} />
    </div>
);