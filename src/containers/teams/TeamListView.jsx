import * as React from "react";
import { List, ListItem } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import Divider from "material-ui/Divider";
import ActionInfo from "material-ui/svg-icons/action/info";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const getItem = (props) => {
    return props.items.map((item, i, arr) => <ListItem key={i} primaryText={item.name} leftIcon={<ActionGrade />} rightIcon={(props.actionChild) ? props.actionChild : <ActionInfo />} onClick={() => props.onSelectItem(item)}/>);
};
export const TeamListView = (props) => (<MuiThemeProvider>
        <div>
            <List>
                {(props.items && props.items.length > 0) ?
    getItem(props) : null}
            </List>
            <Divider />
        </div>
    </MuiThemeProvider>);
