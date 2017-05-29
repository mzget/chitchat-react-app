"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var SimpleCardImage = function (props) { return (React.createElement(Card_1.Card, null,
    React.createElement(Card_1.CardMedia, null,
        React.createElement("img", { src: props.src, width: '100%', alt: "Image preview..." })))); };
exports.__esModule = true;
exports["default"] = SimpleCardImage;
