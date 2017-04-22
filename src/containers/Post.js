"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const Subheader_1 = require("material-ui/Subheader");
const Colors = require("material-ui/styles/colors");
class Post extends React.Component {
    constructor() {
        super(...arguments);
        this.headerHeight = 56;
        this.footerHeight = 24;
    }
    render() {
        return (React.createElement("div", { style: { overflow: "hidden" } },
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50 } },
                React.createElement(Subheader_1.default, null, "Feeds"),
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    React.createElement(reflexbox_1.Flex, { align: "center" },
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                    React.createElement(reflexbox_1.Box, { flexAuto: true, justify: "flex-end" }))),
            React.createElement("div", { id: "app_footer", style: {
                    height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
                } },
                React.createElement(reflexbox_1.Flex, { px: 2, align: "center", justify: "center" },
                    React.createElement("span", null, "Powered by Stalk realtime messaging service.")))));
    }
}
exports.Post = Post;
