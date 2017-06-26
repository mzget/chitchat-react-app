import * as React from "react";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import { IOrgChart, OrgLevel } from "../chitchat/chats/models/OrgChart";

interface IComponentProps {
    items: Array<IOrgChart>;
    onSelected?: (item: IOrgChart) => void;
}

const renderList = (props: IComponentProps) => (
    props.items.map((item, i) => (
        <div key={i}>
            <ListItem
                leftIcon={null}
                rightIcon={null}
                primaryText={item.chart_name}
                secondaryText={
                    <p style={{ color: darkBlack }}>{item.chart_description}</p>
                }
                onClick={(event) => props.onSelected(item)}
            />
            <Divider />
        </div>))
);

export const OrgChartListView = (props: IComponentProps) => (
    <div>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </div>
);