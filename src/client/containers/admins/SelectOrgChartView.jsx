import * as React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
export const SelectOrgChartView = (props) => (<SelectField floatingLabelText="Org Charts" value={props.dropdownValue} onChange={props.dropdownChange}>
        {(props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => <MenuItem key={id} value={id} primaryText={value.chart_name}/>) : null}
    </SelectField>);
