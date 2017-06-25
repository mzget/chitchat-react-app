import * as React from "react";
import Flexbox from "flexbox-react";
import { OrgChartListView } from "../../components/OrgChartListView";
import { Subheader, RaisedButton } from "material-ui";
export const OrgChartPreview = (props) => (<Flexbox flexDirection={"column"} minWidth={"400px"} justifyContent={"center"}>
        <Subheader>Org Charts</Subheader>
        <OrgChartListView items={props.orgCharts} onSelected={props.onSelectItem}/>
        <RaisedButton label="Create New" primary={true} onClick={props.onCreateNew}/>
    </Flexbox>);
