import * as React from "react";
import { List, ListItem } from "material-ui/List";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentSend from "material-ui/svg-icons/content/send";
import ContentDrafts from "material-ui/svg-icons/content/drafts";
import Divider from "material-ui/Divider";
import ActionInfo from "material-ui/svg-icons/action/info";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";

interface IComponentProps {
    menus: string[];
    onSelectItem: (key: string) => void;
    title?: string;
}

const getItem = (props: IComponentProps) => {
    return props.menus.map((item, i, arr) =>
        <ListItem key={i}
            primaryText={item}
            leftIcon={<ActionGrade />}
            rightIcon={<ActionInfo />}
            onClick={() => props.onSelectItem(item)} />
    );
};

export const MenuListview = (props: IComponentProps) => (
    <MuiThemeProvider >
        <div>
            {
                (props.title) ? <Subheader>{props.title}</Subheader> : null
            }
            <List> {
                (props.menus && props.menus.length > 0) ?
                    getItem(props) : null
            }
            </List>
            <Divider />
            <Divider />
        </div>
    </MuiThemeProvider >
);