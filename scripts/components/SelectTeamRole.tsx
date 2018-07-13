import * as React from "react";
import { RaisedButton, TextField, MenuItem, SelectField, Subheader } from "material-ui";

export interface ISelectTeamRole {
    teamRoleItems: Array<string>;
    teamRoleValue: number;
    onTeamRoleChange: (event, id, value) => void;
}
export const SelectTeamRole = (props: ISelectTeamRole) => (
    <SelectField
        value={props.teamRoleValue}
        onChange={props.onTeamRoleChange}
        style={{width: "100%"}} >
        {
            (props.teamRoleItems.length > 0) ?
                props.teamRoleItems.map((value, id) =>
                    <MenuItem key={id} value={id} primaryText={value} />) : null
        }
    </SelectField>
);