import * as React from "react";
import Flexbox from "flexbox-react";

import { OrgChartListView } from "../../components/OrgChartListView";
import { Card, CardTitle, RaisedButton } from "material-ui";

import { IOrgChart, OrgLevel } from "../../chitchat/chats/models/OrgChart";

interface ICompProps {
    orgCharts: Array<any>;
    onCreateNew: () => void;
    onSelectItem: (item: IOrgChart) => void;
}

export const OrgChartPreview = (props: ICompProps) => (
    <Flexbox flexDirection={"column"} minWidth={"400px"} justifyContent={"center"}>
        <Card>
            <CardTitle title="Org Charts" />
        </Card>
        <OrgChartListView items={props.orgCharts} onSelected={props.onSelectItem} />
        <RaisedButton label="Create New" primary={true} onClick={props.onCreateNew} />
    </Flexbox>
);