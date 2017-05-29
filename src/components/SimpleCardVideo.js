"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var SimpleCardVideo = function (props) { return (React.createElement(Card_1.Card, null,
    React.createElement(Card_1.CardMedia, null,
        React.createElement("video", { preload: 'metadata' },
            React.createElement("source", { src: props.src }),
            "Sorry; your browser doesn't support HTML5 video.")))); };
exports.__esModule = true;
exports["default"] = SimpleCardVideo;
