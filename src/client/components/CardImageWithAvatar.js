import * as React from "react";
import { Card, CardHeader, CardMedia, CardText } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
export const CardImageWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: grey400 } },
    React.createElement(Card, null,
        React.createElement(CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(CardText, { style: { color: "black", marginLeft: 15 } }, props.cardText),
        React.createElement(CardMedia, null,
            React.createElement("img", { src: props.imageSrc, style: { padding: 5 }, alt: `Image preview: ${props.cardText}` })))));
export const CardStickerWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: grey400 } },
    React.createElement(Card, null,
        React.createElement(CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(CardMedia, null,
            React.createElement("img", { src: props.imageSrc, alt: `Image preview:`, style: { padding: 4, width: "50%", minWidth: "128px", maxWidth: "160px" } })))));
