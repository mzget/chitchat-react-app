import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Flexbox from "flexbox-react";
import FlatButton from "material-ui/FlatButton";
import * as Colors from "material-ui/styles/colors";
import Paper from 'material-ui/Paper';

import { IComponentProps } from "../../utils/IComponentProps";
import { CreateOrgChartForm } from "./CreateOrgChartForm";
import { OrgChartPreview } from "./OrgChartPreview";
import { GroupsPure } from "./GroupsOfChart";
import { IOrgChart, OrgLevel } from "../../chitchat/chats/models/OrgChart";
import { Room } from "../../chitchat/chats/models/Room";

import * as adminRx from "../../redux/admin/adminRx";

enum Page {
    index = 0, create = 1, detail = 2
}
interface IComponentNameState {
    dropdownValue: number;
    chart_name: string;
    chart_description: string;

    page: Page;
    chartItem: IOrgChart;
};

class OrgChartBox extends React.Component<IComponentProps, IComponentNameState> {
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

            page: Page.index,
            chartItem: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onCreateNew = this.onCreateNew.bind(this);
        this.onSelectChart = this.onSelectChart.bind(this);
        this.onSelectGroup = this.onSelectGroup.bind(this);
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
        const { teamReducer, userReducer } = this.props;

        if (this.state.chart_name.length > 0) {
            this.orgChart.chart_level = this.state.dropdownValue;
            this.orgChart.team_id = teamReducer.team._id;
            this.orgChart.chart_name = this.state.chart_name;
            this.orgChart.chart_description = this.state.chart_description;

            this.props.dispatch(adminRx.createNewOrgChart(this.orgChart, userReducer.teamProfile.team_role));
        }
        else {
            this.props.onError("Missing require field");
        }
    }

    onCreateNew() {
        this.setState(prevState => ({
            ...prevState,
            page: Page.create
        }));
    }
    onSelectChart(item: IOrgChart) {
        this.setState(prevState => ({
            ...prevState,
            page: Page.detail,
            chartItem: item
        }));
    }
    onSelectGroup(item: Room) {
        this.props.history.push(`/admin/group/${item._id}`);
    }

    getPage(page: Page) {
        switch (page) {
            case Page.index:
                return <OrgChartPreview
                    orgCharts={this.props.adminReducer.orgCharts}
                    onCreateNew={this.onCreateNew}
                    onSelectItem={this.onSelectChart} />
            case Page.create:
                return <CreateOrgChartForm
                    orgChartName={this.state.chart_name}
                    orgChart_description={this.state.chart_description}
                    onOrgChartNameChange={(e, text) => { this.setState(previous => ({ ...previous, chart_name: text })); }}
                    onOrgChartDescriptionChange={(e, text) => { this.setState(previous => ({ ...previous, chart_description: text })); }}

                    dropdownItems={this.orgLevels}
                    dropdownValue={this.state.dropdownValue}
                    dropdownChange={(event, id, value) => { this.setState(previous => ({ ...previous, dropdownValue: value })); }}
                    onSubmit={this.onSubmit}
                />
            case Page.detail:
                return <GroupsPure
                    chartItem={this.state.chartItem}
                    onSelectItem={this.onSelectGroup} />
            default:
                break;
        }
    }

    public render(): JSX.Element {
        return (
            <Flexbox flexDirection="row" justifyContent="center" style={{ width: "100%", backgroundColor: Colors.darkWhite }}>
                <Flexbox flexGrow={1} />
                <Paper zDepth={1} style={{ width: 400 }}>
                    {
                        this.getPage(this.state.page)
                    }
                </Paper>
                <Flexbox flexGrow={1} />
            </Flexbox>
        );
    }
}

const mapStateToProps = (state) => ({
    adminReducer: state.adminReducer,
    userReducer: state.userReducer,
    teamReducer: state.teamReducer
});
export var ManageOrgChartBox = connect(mapStateToProps)(OrgChartBox) as React.ComponentClass<any>;
ManageOrgChartBox = withRouter(ManageOrgChartBox) as React.ComponentClass<{ onError }>;