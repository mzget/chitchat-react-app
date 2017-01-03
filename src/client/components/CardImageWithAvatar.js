"use strict";
const React = require("react");
const Card_1 = require("material-ui/Card");
const CardImageWithAvatar = (props) => (React.createElement(Card_1.Card, null,
    React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
    React.createElement(Card_1.CardText, { style: { color: 'black', marginLeft: 15 } }, props.cardText),
    React.createElement(Card_1.CardMedia, { overlay: React.createElement(Card_1.CardTitle, { title: "Overlay title", subtitle: "Overlay subtitle" }) },
        React.createElement("img", { src: props.imageSrc }))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardImageWithAvatar;
