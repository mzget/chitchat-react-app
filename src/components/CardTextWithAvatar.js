"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Card_1 = require("material-ui/Card");
const colors_1 = require("material-ui/styles/colors");
exports.CardTextWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Card_1.CardText, { style: { color: "black", marginLeft: 15 } }, props.cardText))));
