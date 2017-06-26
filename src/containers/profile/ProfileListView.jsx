import * as React from "react";
import { List, ListItem } from "material-ui/List";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
export const ProfileListView = (props) => (<MuiThemeProvider>
        {(props.item) ?
    <List>
                    <ListItem onClick={() => props.onSelected(props.item)} leftAvatar={(!!props.item.avatar) ?
        <Avatar src={props.item.avatar}/> : <Avatar>{props.item.username.charAt(0)}</Avatar>} rightIcon={null} primaryText={<span>{props.item.username}</span>} secondaryText={<p>
                                <span>{props.item.email}</span>
                            </p>}/>
                </List> : null}
    </MuiThemeProvider>);
