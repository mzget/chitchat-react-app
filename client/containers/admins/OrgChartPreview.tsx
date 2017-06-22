import * as React from "react";

import { OrgChartListView } from "./OrgChartListView";
import FlatButton from "material-ui/FlatButton";

import { IOrgChart, OrgLevel } from "../../chitchat/chats/models/OrgChart";

interface ICompProps {
    orgCharts: Array<any>;
    onCreateNew: () => void;
    onSelectItem: (item: IOrgChart) => void;
}

export const OrgChartPreview = (props: ICompProps) => (
    <div style={{ width: `100%` }}>
        <OrgChartListView items={props.orgCharts} onSelected={props.onSelectItem} />
        <FlatButton label="Create New" primary={true} onClick={props.onCreateNew} />
    </div>
);