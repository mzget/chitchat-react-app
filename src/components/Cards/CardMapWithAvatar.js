import * as React from "react";
import Flexbox from "flexbox-react";
import Divider from 'material-ui/Divider';
import { Card, CardHeader } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
import { SimpleMapPreview } from "../Maps/SimpleMapPreview";
export const CardMapWithAvatar = (props) => (React.createElement("div", { style: { padding: 2, color: grey400 } },
    React.createElement(Card, null,
        React.createElement(CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(Flexbox, { flexDirection: "row", justifyContent: "center" },
            React.createElement(SimpleMapPreview, { marker: props.content })),
        React.createElement(Divider, { inset: false }),
        (!!props.readers && props.readers.length) ? (React.createElement("div", null,
            React.createElement(Divider, { inset: false }),
            React.createElement("a", { style: { padding: 5 }, onClick: props.onClickReader }, props.readers))) : null)));
