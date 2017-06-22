import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

const styles = {
    span: {
        padding: 8
    },
    box: {
        bottom: 0,
        position: "absolute"
    },
    customWidth: {
        width: 200,
        fontSize: 16
    }
};

interface IComponentProps {
    onSubmit: () => void;
    orgChartName: string;
    onOrgChartNameChange: (e, text) => void;
    orgChart_description?: string;
    onOrgChartDescriptionChange?: (e, text) => void;

    dropdownItems: Array<string>;
    dropdownValue: number;
    dropdownChange: (event, index, value) => void;
}

const SubmitButton = (props: IComponentProps) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} >
    </RaisedButton>
);

const ChartLevel = (props: IComponentProps) => (
    <SelectField
        floatingLabelText="Org Level"
        value={props.dropdownValue}
        onChange={props.dropdownChange}
    >
        {
            (props.dropdownItems.length > 0) ?
                props.dropdownItems.map((value, id) =>
                    <MenuItem key={id} value={id} primaryText={value} />) : null
        }
    </SelectField>
);

export const CreateOrgChartForm = (props: IComponentProps) => (
    <MuiThemeProvider>
        <Flexbox style={{ backgroundColor: Colors.darkWhite }} width="100%" flexDirection="column" alignItems="center">
            <Flexbox justifyContent="center" alignItems="center" >
                <h3>Create new ORG chart</h3>
            </Flexbox>
            <TextField
                hintText="Name"
                errorText="This field is required"
                value={props.orgChartName}
                onChange={props.onOrgChartNameChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") props.onSubmit();
                }} />
            <span style={styles.span} />
            <TextField
                hintText="Description"
                value={props.orgChart_description}
                onChange={props.onOrgChartDescriptionChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") props.onSubmit();
                }} />
            <span style={styles.span} />
            <ChartLevel {...props} />
            <span style={styles.span} />
            <SubmitButton {...props} />
        </Flexbox>
    </MuiThemeProvider >
);
