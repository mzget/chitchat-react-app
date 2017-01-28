import * as React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';

import BadgeSimple from "../../components/BadgeSimple";

import { IOrgChart, OrgLevel } from "../../../server/scripts/models/OrgChart";

interface IComponentProps {
    items: Array<IOrgChart>;
    onSelected?: (item: IOrgChart) => void;
}

const renderList = (props: IComponentProps) => (
    props.items.map((item, i) => (
        <div key={i}>
            <ListItem
                onClick={() => props.onSelected(item)}
                leftIcon={null}
                rightIcon={null}
                primaryText={item.chart_name}
                secondaryText={
                    <p>
                        <span style={{ color: darkBlack }}>{item.chart_description}</span>
                    </p>
                }
            />
            <Divider inset={true} />
        </div>))
);

export const OrgChartListView = (props: IComponentProps) => (
    <MuiThemeProvider>
        <div>
            <Subheader>Org Charts</Subheader>
            <List>
                {(!!props.items) ? renderList(props) : null}
            </List>
        </div>
    </MuiThemeProvider>
);