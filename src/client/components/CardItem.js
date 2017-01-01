"use strict";
const react_1 = require("react");
const Card_1 = require("material-ui/Card");
const FlatButton_1 = require("material-ui/FlatButton");
const CardWithAvatar = () => (react_1.default.createElement(Card_1.Card, null,
    react_1.default.createElement(Card_1.CardHeader, { title: "URL Avatar", subtitle: "Subtitle", avatar: "images/jsa-128.jpg" }),
    react_1.default.createElement(Card_1.CardMedia, { overlay: react_1.default.createElement(Card_1.CardTitle, { title: "Overlay title", subtitle: "Overlay subtitle" }) },
        react_1.default.createElement("img", { src: "images/nature-600-337.jpg" })),
    react_1.default.createElement(Card_1.CardTitle, { title: "Card title", subtitle: "Card subtitle" }),
    react_1.default.createElement(Card_1.CardText, null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit." + " " + "Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi." + " " + "Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque." + " " + "Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."),
    react_1.default.createElement(Card_1.CardActions, null,
        react_1.default.createElement(FlatButton_1.default, { label: "Action1" }),
        react_1.default.createElement(FlatButton_1.default, { label: "Action2" }))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardWithAvatar;
