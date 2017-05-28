import * as React from "react";
import { ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
export const IncomingList = (props) => (React.createElement(ListItem, { onClick: () => props.onSelected(props.message), leftAvatar: (!!props.message.user.avatar) ?
        React.createElement(Avatar, { src: props.message.user.avatar }) : React.createElement(Avatar, null, props.message.user.username.charAt(0)), primaryText: props.message.body, secondaryText: React.createElement("p", null,
        React.createElement("span", null, props.message.createTime)) }));
export const OutComingList = (props) => (React.createElement(ListItem, { onClick: () => props.onSelected(props.message), primaryText: props.message.body, secondaryText: React.createElement("p", null,
        React.createElement("span", null, props.message.createTime)), style: { textAlign: "right" } }));
