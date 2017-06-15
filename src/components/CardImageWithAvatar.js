"use strict";
var React = require("react");
var Divider_1 = require("material-ui/Divider");
var colors_1 = require("material-ui/styles/colors");
var Card_1 = require("material-ui/Card");
exports.CardImageWithAvatar = function (props) { return (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Card_1.CardText, { style: { color: "black", marginLeft: 15 } }, props.cardText),
        React.createElement(Card_1.CardMedia, null,
            React.createElement("img", { src: props.imageSrc, style: { padding: 5, maxWidth: "250px" }, alt: "Image preview: " + props.cardText })),
        (!!props.readers && props.readers.length) ? (React.createElement("div", null,
            React.createElement(Divider_1["default"], { inset: false }),
            React.createElement("a", { style: { padding: 5 }, onClick: props.onClickReader }, props.readers))) : null))); };
exports.CardStickerWithAvatar = function (props) { return (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Card_1.CardMedia, null,
            React.createElement("img", { src: props.imageSrc, alt: "Image preview:", style: { padding: 4, width: "50%", minWidth: "128px", maxWidth: "160px" } })),
        (!!props.readers && props.readers.length) ? (React.createElement("div", null,
            React.createElement(Divider_1["default"], { inset: false }),
            React.createElement("a", { style: { padding: 5 }, onClick: props.onClickReader }, props.readers))) : null))); };
