import * as React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import { IOrgChart } from "../../../server/scripts/models/OrgChart";

interface IComponentProps {
    dropdownItems: Array<IOrgChart>;
    dropdownValue: number;
    dropdownChange: (event, id, value) => void;
}
export const SelectOrgChartView = (props: IComponentProps) => (
    <SelectField
        floatingLabelText="Org Charts"
        value={props.dropdownValue}
        onChange={props.dropdownChange}  >
        {
            (props.dropdownItems.length > 0) ?
                props.dropdownItems.map((value, id) =>
                    <MenuItem key={id} value={id} primaryText={value.chart_name} />) : null
        }
    </SelectField>
);