"use strict";
const React = require("react");
const Card_1 = require("material-ui/Card");
const SimpleCardVideo = (props) => (React.createElement(Card_1.Card, null,
    React.createElement(Card_1.CardMedia, null,
        React.createElement("video", { preload: 'metadata' },
            React.createElement("source", { src: props.src }),
            "Sorry; your browser doesn't support HTML5 video."))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleCardVideo;
