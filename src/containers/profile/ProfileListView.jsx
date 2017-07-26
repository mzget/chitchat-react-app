import * as React from "react";
import { List, ListItem } from "material-ui/List";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
export const ProfileListView = (props) => (<MuiThemeProvider>
        {(props.item) ?
    <List>
                    <ListItem onClick={() => props.onSelected(props.item)} leftAvatar={(!!props.item.avatar) ?
        <Avatar src={props.item.avatar}/> : <Avatar>{props.item.username.charAt(0)}</Avatar>} rightIcon={null} primaryText={<span style={props.styles}>{`${props.item.firstname} ${props.item.lastname}`}</span>} secondaryText={<p>
                                <span style={props.styles}>{props.item.email}</span>
                            </p>}/>
                </List> : null}
    </MuiThemeProvider>);
