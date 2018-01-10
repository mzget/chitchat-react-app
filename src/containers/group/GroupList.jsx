import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { darkBlack } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
const renderList = (props) => (props.values.map((item, i) => {
    return (<div key={i}>
            <ListItem onClick={() => props.onSelected(item)} leftAvatar={(!!item.image) ?
        <Avatar src={item.image}/> : <Avatar>{item.name.charAt(0)}</Avatar>} rightIcon={null} primaryText={item.name} secondaryText={<p>
                        <span style={{ color: darkBlack }}>{item.description}</span>
                    </p>}/>
            <Divider inset={true}/>
        </div>);
}));
export const GroupList = (props) => (<MuiThemeProvider>
        <List>
            {(!!props.values) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>);
