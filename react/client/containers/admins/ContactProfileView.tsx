import * as React from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, TextField, MenuItem, SelectField, Subheader } from "material-ui";

import { ChitChatAccount } from "../../../server/scripts/models/User";
import { IOrgChart } from "../../../server/scripts/models/OrgChart";

interface IComponentProps {
    member: ChitChatAccount;
    onSubmit: () => void;
    dropdownItems: Array<IOrgChart>;
    dropdownValue: number;
    dropdownChange: (event, id, value) => void;
}


const SubmitButton = (props: IComponentProps) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
);

const SelectOrgChart = (props: IComponentProps) => (
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

export const ContactProfileView = (props: IComponentProps) => {
    return (
        <MuiThemeProvider>
            <div>
                <Subheader>Profile</Subheader>
                <p>{props.member.username}</p>
                <p>{props.member.firstname}</p>
                <p>{props.member.lastname}</p>
                <p>{props.member.email}</p>
                <SelectOrgChart {...props} />
                <SubmitButton {...props} />
            </div>
        </MuiThemeProvider>
    );
};