import * as React from "react";
import { MenuItem, SelectField } from "material-ui";
export const SelectTeamRole = (props) => (<SelectField value={props.teamRoleValue} onChange={props.onTeamRoleChange} style={{ width: "100%" }}>
        {(props.teamRoleItems.length > 0) ?
    props.teamRoleItems.map((value, id) => <MenuItem key={id} value={id} primaryText={value}/>) : null}
    </SelectField>);
