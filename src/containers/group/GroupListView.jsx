import * as React from "react";
import Subheader from "material-ui/Subheader";
import { GroupList } from "./GroupList";
export const GroupListView = (props) => (<div>
        <Subheader>{props.subHeader}</Subheader>
        <GroupList values={props.groups} onSelected={props.onselectGroup}/>
    </div>);
