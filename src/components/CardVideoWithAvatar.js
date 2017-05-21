import * as React from "react";
import { Card, CardHeader, CardMedia, CardText } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
export const CardVideoWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: grey400 } },
    React.createElement(Card, null,
        React.createElement(CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(CardText, { style: { color: "black", marginLeft: 15 } }, props.cardText),
        React.createElement(CardMedia, null,
            React.createElement("video", { controls: true, preload: "metadata" },
                React.createElement("source", { src: props.src }),
                "Sorry; your browser doesn't support HTML5 video.")))));
