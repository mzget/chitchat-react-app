import * as React from "react";
import Flexbox from "flexbox-react";
import { Card, CardTitle } from "material-ui";
import { darkWhite } from "material-ui/styles/colors";
import { MemberList } from "./MemberList";
const Styles = require("../styles/generalStyles");
const PageBox = Styles.generalStyles.pageBox;
export const TeamsList = (props) => (React.createElement(Flexbox, { width: "100%", justifyContent: "center", style: { backgroundColor: darkWhite } },
    React.createElement(Flexbox, { flexDirection: "column", minWidth: "400px" },
        React.createElement(Card, null,
            React.createElement(CardTitle, { title: "Team Lists" })),
        React.createElement("div", { style: PageBox },
            React.createElement(MemberList, { onSelected: props.onSelectMember, items: props.members })))));
