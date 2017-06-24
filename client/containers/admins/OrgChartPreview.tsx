import * as React from "react";

import { OrgChartListView } from "../../components/OrgChartListView";
import FlatButton from "material-ui/FlatButton";
import Subheader from "material-ui/Subheader";

import { IOrgChart, OrgLevel } from "../../chitchat/chats/models/OrgChart";

interface ICompProps {
    orgCharts: Array<any>;
    onCreateNew: () => void;
    onSelectItem: (item: IOrgChart) => void;
}

export const OrgChartPreview = (props: ICompProps) => (
    <div style={{ width: `100%` }}>
        <Subheader>Org Charts</Subheader>
        <OrgChartListView items={props.orgCharts} onSelected={props.onSelectItem} />
        <FlatButton label="Create New" primary={true} onClick={props.onCreateNew} />
    </div>
);