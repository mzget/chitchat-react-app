import * as React from "react";
import Subheader from "material-ui/Subheader";
import { GroupList } from "./GroupList";
export const GroupListView = (props) => (React.createElement("div", null,
    React.createElement(Subheader, null, props.subHeader),
    React.createElement(GroupList, { values: props.groups, onSelected: props.onselectGroup })));
