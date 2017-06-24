import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { darkBlack } from "material-ui/styles/colors";
const renderList = (props) => (props.items.map((item, i) => (React.createElement("div", { key: i },
    React.createElement(ListItem, { leftIcon: null, rightIcon: null, primaryText: item.name, secondaryText: React.createElement("p", { style: { color: darkBlack } }, item.description), onClick: (event) => props.onSelected(item) }),
    React.createElement(Divider, null)))));
export const GroupListView = (props) => (React.createElement("div", null,
    React.createElement(List, null, (!!props.items) ? renderList(props) : null)));
