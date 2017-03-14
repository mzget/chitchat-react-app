"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Card_1 = require("material-ui/Card");
const CardVideoWithAvatar = (props) => (React.createElement(Card_1.Card, null,
    React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
    React.createElement(Card_1.CardText, { style: { color: 'black', marginLeft: 15 } }, props.cardText),
    React.createElement(Card_1.CardMedia, null,
        React.createElement("video", { controls: true, preload: 'metadata' },
            React.createElement("source", { src: props.src }),
            "Sorry; your browser doesn't support HTML5 video."))));
exports.default = CardVideoWithAvatar;
