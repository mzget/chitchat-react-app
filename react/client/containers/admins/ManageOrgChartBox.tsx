import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import FlatButton from "material-ui/FlatButton";
import * as Colors from "material-ui/styles/colors";

import { IComponentProps } from "../../utils/IComponentProps";
import { CreateOrgChartForm } from "./CreateOrgChartForm";
import { OrgChartListView } from "./OrgChartListView";
import { IOrgChart, OrgLevel } from "../../../../shared/models/OrgChart";

import * as adminRx from "../../redux/admin/adminRx";

abstract class IComponentNameProps implements IComponentProps {
    onError?: (error: string) => void;
    location;
    params;
    router;
    dispatch;
    routing;
    authReducer;
    adminReducer;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
    teamReducer;
    groupReducer;
};

interface IComponentNameState {
    dropdownValue: number;
    chart_name: string;
    chart_description: string;

    isOpenCreateNewForm: boolean;
};

class ManageOrgChartBox extends React.Component<IComponentNameProps, IComponentNameState> {
    orgChart: IOrgChart = {} as IOrgChart;
    orgLevels: Array<string> = new Array();

    componentWillMount() {
        this.orgChart.chart_name = "";
        this.orgChart.chart_description = "";
        this.orgLevels = [OrgLevel[OrgLevel.department], OrgLevel[OrgLevel.division], OrgLevel[OrgLevel.section], OrgLevel[OrgLevel.unit]];

        this.state = {
            dropdownValue: 0,
            chart_name: "",
            chart_description: "",

            isOpenCreateNewForm: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onCreateNew = this.onCreateNew.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        const { adminReducer } = nextProps;

        switch (adminReducer.state) {
            case adminRx.CREATE_NEW_ORG_CHART_SUCCESS:
                this.setState(prevState => ({ ...prevState, isOpenCreateNewForm: false }));
                break;

            default:
                break;
        }
    }

    onSubmit() {
        const { teamReducer } = this.props;

        if (this.state.chart_name.length > 0) {
            this.orgChart.chart_level = this.state.dropdownValue;
            this.orgChart.team_id = teamReducer.team._id;
            this.orgChart.chart_name = this.state.chart_name;
            this.orgChart.chart_description = this.state.chart_description;

            this.props.dispatch(adminRx.createNewOrgChart(this.orgChart));
        }
        else {
            this.props.onError("Missing require field");
        }
    }

    onCreateNew() {
        this.setState(prevState => ({ ...prevState, isOpenCreateNewForm: !this.state.isOpenCreateNewForm }));
    }

    public render(): JSX.Element {
        return (
            <Flex flexColumn justify="center" style={{ backgroundColor: Colors.indigo50 }}>
                {
                    (this.state.isOpenCreateNewForm) ? (
                        <CreateOrgChartForm
                            orgChartName={this.state.chart_name}
                            orgChart_description={this.state.chart_description}
                            onOrgChartNameChange={(e, text) => { this.setState(previous => ({ ...previous, chart_name: text })); }}
                            onOrgChartDescriptionChange={(e, text) => { this.setState(previous => ({ ...previous, chart_description: text })); }}

                            dropdownItems={this.orgLevels}
                            dropdownValue={this.state.dropdownValue}
                            dropdownChange={(event, id, value) => { this.setState(previous => ({ ...previous, dropdownValue: value })); }}
                            onSubmit={this.onSubmit}
                        />
                    ) : (
                            <div>
                                <OrgChartListView items={this.props.adminReducer.orgCharts} />
                                <FlatButton label="Create New" primary={true} onClick={this.onCreateNew} />
                            </div>
                        )
                }
            </Flex>
        );
    }
}

export default ManageOrgChartBox;