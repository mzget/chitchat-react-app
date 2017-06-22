import * as React from "react";

import { OrgChartListView } from "./OrgChartListView";
import FlatButton from "material-ui/FlatButton";

interface ICompProps {
    orgCharts: Array<any>;
    onCreateNew: () => void;
}

export const OrgChartPreview = (props: ICompProps) => (
    <div style={{ width: `100%` }}>
        <OrgChartListView items={props.orgCharts} />
        <FlatButton label="Create New" primary={true} onClick={props.onCreateNew} />
    </div>
);