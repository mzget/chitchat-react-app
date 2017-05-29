"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var colors_1 = require("material-ui/styles/colors");
exports.CardImageWithAvatar = function (props) { return (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Card_1.CardText, { style: { color: "black", marginLeft: 15 } }, props.cardText),
        React.createElement(Card_1.CardMedia, null,
            React.createElement("img", { src: props.imageSrc, style: { padding: 5 }, alt: "Image preview: " + props.cardText }))))); };
exports.CardStickerWithAvatar = function (props) { return (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Card_1.CardMedia, null,
            React.createElement("img", { src: props.imageSrc, alt: "Image preview:", style: { padding: 4, width: "50%", minWidth: "128px", maxWidth: "160px" } }))))); };
