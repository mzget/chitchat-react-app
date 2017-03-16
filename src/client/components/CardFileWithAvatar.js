"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const Card_1 = require("material-ui/Card");
const FlatButton_1 = require("material-ui/FlatButton");
const colors_1 = require("material-ui/styles/colors");
exports.CardFileWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(reflexbox_1.Flex, { flexColumn: false },
            React.createElement("img", { src: props.imageSrc, style: { padding: 5 }, alt: `Image preview: ${props.cardText}` }),
            React.createElement("p", { style: { color: colors_1.lightBlack, marginLeft: 15 } }, props.cardText)),
        React.createElement(Card_1.CardActions, null,
            React.createElement(FlatButton_1.default, { label: "Open", primary: true, onClick: props.openAction })))));
