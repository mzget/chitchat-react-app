import * as React from "react";
import { OrgChartListView } from "./OrgChartListView";
import FlatButton from "material-ui/FlatButton";
export const OrgChartPreview = (props) => (React.createElement("div", { style: { width: `100%` } },
    React.createElement(OrgChartListView, { items: props.orgCharts }),
    React.createElement(FlatButton, { label: "Create New", primary: true, onClick: props.onCreateNew })));
