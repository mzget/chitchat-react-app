import * as React from "react";
import { List, ListItem } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import Divider from "material-ui/Divider";
import ActionInfo from "material-ui/svg-icons/action/info";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";
const getItem = (props) => {
    return props.menus.map((item, i, arr) => <ListItem key={i} primaryText={item} leftIcon={<ActionGrade />} rightIcon={<ActionInfo />} onClick={() => props.onSelectItem(item)}/>);
};
export const MenuListview = (props) => (<MuiThemeProvider>
        <div>
            {(props.title) ? <Subheader>{props.title}</Subheader> : null}
            <List> {(props.menus && props.menus.length > 0) ?
    getItem(props) : null}
            </List>
            <Divider />
            <Divider />
        </div>
    </MuiThemeProvider>);
