"use strict";
exports.__esModule = true;
var React = require("react");
var flexbox_react_1 = require("flexbox-react");
var Divider_1 = require("material-ui/Divider");
var Card_1 = require("material-ui/Card");
var colors_1 = require("material-ui/styles/colors");
var SimpleMapPreview_1 = require("../Maps/SimpleMapPreview");
exports.CardMapWithAvatar = function (props) { return (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(flexbox_react_1["default"], { flexDirection: "row", justifyContent: "center" },
            React.createElement(SimpleMapPreview_1.SimpleMapPreview, { marker: props.content })),
        React.createElement(Divider_1["default"], { inset: false }),
        (!!props.readers && props.readers.length) ? (React.createElement("div", null,
            React.createElement(Divider_1["default"], { inset: false }),
            React.createElement("a", { style: { padding: 5 }, onClick: props.onClickReader }, props.readers))) : null))); };
