import * as React from "react";
import { OrgChartListView } from "./OrgChartListView";
import FlatButton from "material-ui/FlatButton";
import Subheader from "material-ui/Subheader";
export const OrgChartPreview = (props) => (React.createElement("div", { style: { width: `100%` } },
    React.createElement(Subheader, null, "Org Charts"),
    React.createElement(OrgChartListView, { items: props.orgCharts, onSelected: props.onSelectItem }),
    React.createElement(FlatButton, { label: "Create New", primary: true, onClick: props.onCreateNew })));
