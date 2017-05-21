import * as React from "react";
import { Card, CardHeader, CardText } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
export const CardTextWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: grey400 } },
    React.createElement(Card, null,
        React.createElement(CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(CardText, { style: { color: "black", marginLeft: 15 } }, props.cardText))));
