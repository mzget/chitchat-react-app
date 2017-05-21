import * as React from "react";
import { Flex, Box } from "reflexbox";
import Subheader from "material-ui/Subheader";
import * as Colors from "material-ui/styles/colors";
export class Post extends React.Component {
    constructor() {
        super(...arguments);
        this.headerHeight = 56;
        this.footerHeight = 24;
    }
    render() {
        return (React.createElement("div", { style: { overflow: "hidden" } },
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50 } },
                React.createElement(Subheader, null, "Feeds"),
                React.createElement(Flex, { flexColumn: true },
                    React.createElement(Flex, { align: "center" },
                        React.createElement(Box, { p: 2, flexAuto: true }),
                        React.createElement(Box, { p: 2, flexAuto: true })),
                    React.createElement(Box, { flexAuto: true, justify: "flex-end" }))),
            React.createElement("div", { id: "app_footer", style: {
                    height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
                } },
                React.createElement(Flex, { px: 2, align: "center", justify: "center" },
                    React.createElement("span", null, "Powered by Stalk realtime messaging service.")))));
    }
}
