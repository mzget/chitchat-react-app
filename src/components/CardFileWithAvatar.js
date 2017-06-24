import * as React from "react";
import { Flex } from "reflexbox";
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { grey400, darkBlack } from "material-ui/styles/colors";
export const CardFileWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: grey400 } },
    React.createElement(Card, null,
        React.createElement(CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Flex, { flexColumn: false },
            props.fileIcon,
            React.createElement("p", { style: { color: darkBlack, marginLeft: 15, fontSize: 16 } }, props.cardText)),
        React.createElement(Divider, { inset: false }),
        React.createElement(CardActions, null,
            React.createElement(FlatButton, { label: "Open", primary: true, onClick: props.openAction })),
        (!!props.readers && props.readers.length) ? (React.createElement("div", null,
            React.createElement(Divider, { inset: false }),
            React.createElement("a", { style: { padding: 5 }, onClick: props.onClickReader }, props.readers))) : null)));
