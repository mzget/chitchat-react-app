import * as React from "react";
import { Flex } from "reflexbox";
import * as Colors from "material-ui/styles/colors";
export const WarningBar = () => (React.createElement("div", { id: "warning_bar" },
    React.createElement(Flex, { style: { backgroundColor: Colors.red500 }, align: "center", justify: "center", flexColumn: true },
        React.createElement(Flex, { flexColumn: true },
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Unable to connect whit chat service."),
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Check your Internet connection.")))));
