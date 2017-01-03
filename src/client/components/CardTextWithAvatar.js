"use strict";
const React = require("react");
const Card_1 = require("material-ui/Card");
const CardTextWithAvatar = (props) => (React.createElement(Card_1.Card, null,
    React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
    React.createElement(Card_1.CardText, { style: { color: 'black', marginLeft: 15 } }, props.cardText)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardTextWithAvatar;
