import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
const renderList = (props) => (props.items.map((item, i) => (<div key={i}>
            <ListItem leftIcon={null} rightIcon={null} primaryText={item.name} onClick={(event) => props.onSelected(item)}/>
            <Divider />
        </div>)));
export const TeamRoleListItem = (props) => (<div>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </div>);
