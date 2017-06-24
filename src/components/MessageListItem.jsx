import * as React from "react";
import { ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
export const IncomingList = (props) => (<ListItem onClick={() => props.onSelected(props.message)} leftAvatar={(!!props.message.user.avatar) ?
    <Avatar src={props.message.user.avatar}/> : <Avatar>{props.message.user.username.charAt(0)}</Avatar>} primaryText={props.message.body} secondaryText={<p>
                <span>{props.message.createTime}</span>
            </p>}/>);
export const OutComingList = (props) => (<ListItem onClick={() => props.onSelected(props.message)} primaryText={props.message.body} secondaryText={<p>
                <span>{props.message.createTime}</span>
            </p>} style={{ textAlign: "right" }}/>);
