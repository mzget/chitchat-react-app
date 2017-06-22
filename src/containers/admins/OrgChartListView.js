import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { darkBlack } from "material-ui/styles/colors";
const renderList = (props) => (props.items.map((item, i) => (React.createElement("div", { key: i },
    React.createElement(ListItem, { leftIcon: null, rightIcon: null, primaryText: item.chart_name, secondaryText: React.createElement("p", { style: { color: darkBlack } }, item.chart_description) })))));
export const OrgChartListView = (props) => (React.createElement("div", null,
    React.createElement(Subheader, null, "Org Charts"),
    React.createElement(List, null, (!!props.items) ? renderList(props) : null),
    React.createElement(Divider, null)));
