import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { indigoA700 } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
import Toggle from "material-ui/Toggle";
const addMemberView = (item, onAdded) => (<IconButton tooltip="Add Member" onClick={() => onAdded(item)} style={{ marginTop: 0 }}>
        <FontIcon color={indigoA700} className="material-icons">add_circle</FontIcon>
    </IconButton>);
const renderList = (props) => props.items.map((item, i) => <div key={i}>
        <ListItem onClick={(!!props.onSelected) ? () => props.onSelected(item) : () => { }} leftAvatar={(!!item.avatar) ?
    <Avatar size={32} src={item.avatar}/> : <Avatar size={32}>{item.username.charAt(0)}</Avatar>} rightIcon={(props.onAdded) ? addMemberView(item, props.onAdded) : null} rightToggle={(props.rightToggle) ?
    <Toggle onToggle={(event, isInputChecked) => {
        props.onToggleItem(item, isInputChecked);
    }} disabled={true} defaultToggled={true}/> : null} primaryText={`${item.firstname} ${item.lastname}`}/>
        <Divider inset={true}/>
    </div>);
export const MemberList = (props) => (<MuiThemeProvider>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>);
