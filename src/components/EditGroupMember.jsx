import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
export const EditGroupMember = (props) => {
    return (<MuiThemeProvider>
            <Flexbox alignItems="center">
                <List style={{ width: "100%" }}> {(props.members && props.members.length > 0)
        ? props.members.map((item, i, arr) => {
            if (!!item && !!item.username) {
                return (<div key={i}>
                                        <ListItem leftAvatar={(!!item.avatar) ?
                    <Avatar src={item.avatar} size={30}/> :
                    (!!item.username) ?
                        <Avatar size={30}>{item.username.charAt(0)}</Avatar> :
                        null} primaryText={item.username} rightIconButton={(props.rightIconButton) ? props.rightIconButton(item) : null}/>
                                        <Divider inset={true}/>
                                    </div>);
            }
            else {
                return null;
            }
        }) : null}
                </List>
            </Flexbox>
        </MuiThemeProvider>);
};
