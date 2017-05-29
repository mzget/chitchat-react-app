import * as React from "react";
import { RaisedButton, TextField, MenuItem, SelectField, Subheader } from "material-ui";

import { IOrgChart } from "../chitchat/chats/models/OrgChart";

export interface ISelectChart {
    dropdownItems: Array<IOrgChart>;
    dropdownValue: number;
    dropdownChange: (event, id, value) => void;
}
export const SelectOrgChart = (props: ISelectChart) => (
    <SelectField
        value={props.dropdownValue}
        onChange={props.dropdownChange}
        style={{width: "100%"}} >

        {
            (props.dropdownItems.length > 0) ?
                props.dropdownItems.map((value, id) =>
                    <MenuItem key={id} value={id} primaryText={value.chart_name} />) : null
        }
    </SelectField>
);