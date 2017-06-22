import * as React from "react";
import Flexbox from 'flexbox-react';
import * as Colors from "material-ui/styles/colors";
export const WarningBar = () => (React.createElement("div", { id: "warning_bar" },
    React.createElement(Flexbox, { style: { backgroundColor: Colors.red500 }, flexGrow: 1, alignItems: "center", justifyContent: "center" },
        React.createElement(Flexbox, { flexDirection: "column" },
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Unable to connect whit chat service."),
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Check your Internet connection.")))));
