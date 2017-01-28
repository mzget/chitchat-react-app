import * as React from "react";
import { connect } from "react-redux";

import { CreateOrgChartForm } from "./CreateOrgChartForm";
import { IOrgChart, OrgLevel } from "../../../server/scripts/models/OrgChart";

interface IComponentNameProps {
    onError?: (error: string) => void;
};

interface IComponentNameState {
    dropdownValue: number;
};

class ManageOrgChartBox extends React.Component<IComponentNameProps, IComponentNameState> {
    orgChart: IOrgChart = {} as IOrgChart;
    orgLevels: Array<string> = new Array();

    componentWillMount() {
        this.orgChart.chart_name = "";
        this.orgLevels = [OrgLevel[OrgLevel.department], OrgLevel[OrgLevel.division], OrgLevel[OrgLevel.section], OrgLevel[OrgLevel.unit]];

        this.state = {
            dropdownValue : 0
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {

    }

    public render(): JSX.Element {
        return (
            <div>
                <CreateOrgChartForm {...this.props}
                    orgChartName={this.orgChart.chart_name}
                    orgChart_description={this.orgChart.chart_description}
                    onOrgChartNameChange={(e, text) => { this.orgChart.chart_name = text }}
                    onOrgChartDescriptionChange={(e, text) => { this.orgChart.chart_description = text }}

                    dropdownItems={this.orgLevels}
                    dropdownValue={this.state.dropdownValue}
                    dropdownChange={(event, id, value) => { this.setState(previous => ({ ...previous, dropdownValue: value })) }}
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
}

export default connect()(ManageOrgChartBox);
