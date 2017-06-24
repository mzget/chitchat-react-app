import * as React from "react";
import { OrgChartListView } from "../../components/OrgChartListView";
import FlatButton from "material-ui/FlatButton";
import Subheader from "material-ui/Subheader";
export const OrgChartPreview = (props) => (<div style={{ width: `100%` }}>
        <Subheader>Org Charts</Subheader>
        <OrgChartListView items={props.orgCharts} onSelected={props.onSelectItem}/>
        <FlatButton label="Create New" primary={true} onClick={props.onCreateNew}/>
    </div>);
