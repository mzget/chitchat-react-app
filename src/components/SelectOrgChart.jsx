import * as React from "react";
import { MenuItem, SelectField } from "material-ui";
export const SelectOrgChart = (props) => (<SelectField value={props.dropdownValue} onChange={props.dropdownChange} style={{ width: "100%" }}>

        {(props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => <MenuItem key={id} value={id} primaryText={value.chart_name}/>) : null}
    </SelectField>);
