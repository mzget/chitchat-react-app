import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import Paper from 'material-ui/Paper';
import { CreateOrgChartForm } from "./CreateOrgChartForm";
import { OrgChartPreview } from "./OrgChartPreview";
import { GroupsPure } from "./GroupsOfChart";
import { OrgLevel } from "../../chitchat/chats/models/OrgChart";
import * as adminRx from "../../redux/admin/adminRx";
var Page;
(function (Page) {
    Page[Page["index"] = 0] = "index";
    Page[Page["create"] = 1] = "create";
    Page[Page["detail"] = 2] = "detail";
})(Page || (Page = {}));
;
class OrgChartBox extends React.Component {
    constructor() {
        super(...arguments);
        this.orgChart = {};
        this.orgLevels = new Array();
    }
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
    componentWillReceiveProps(nextProps) {
        const { adminReducer } = nextProps;
        switch (adminReducer.state) {
            case adminRx.CREATE_NEW_ORG_CHART_SUCCESS:
                this.setState(prevState => (Object.assign({}, prevState, { isOpenCreateNewForm: false })));
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
        this.setState(prevState => (Object.assign({}, prevState, { page: Page.create })));
    }
    onSelectChart(item) {
        this.setState(prevState => (Object.assign({}, prevState, { page: Page.detail, chartItem: item })));
    }
    onSelectGroup(item) {
        console.log("onSelectGroup", item);
        this.props.history.push(`/admin/group/${item._id}`);
    }
    getPage(page) {
        switch (page) {
            case Page.index:
                return <OrgChartPreview orgCharts={this.props.adminReducer.orgCharts} onCreateNew={this.onCreateNew} onSelectItem={this.onSelectChart}/>;
            case Page.create:
                return <CreateOrgChartForm orgChartName={this.state.chart_name} orgChart_description={this.state.chart_description} onOrgChartNameChange={(e, text) => { this.setState(previous => (Object.assign({}, previous, { chart_name: text }))); }} onOrgChartDescriptionChange={(e, text) => { this.setState(previous => (Object.assign({}, previous, { chart_description: text }))); }} dropdownItems={this.orgLevels} dropdownValue={this.state.dropdownValue} dropdownChange={(event, id, value) => { this.setState(previous => (Object.assign({}, previous, { dropdownValue: value }))); }} onSubmit={this.onSubmit}/>;
            case Page.detail:
                return <GroupsPure chartItem={this.state.chartItem} onSelectItem={this.onSelectGroup}/>;
            default:
                break;
        }
    }
    render() {
        return (<Flexbox flexDirection="row" justifyContent="center" style={{ width: "100%", backgroundColor: Colors.darkWhite }}>
                <Flexbox flexGrow={1}/>
                <Paper zDepth={1} style={{ width: 400 }}>
                    {this.getPage(this.state.page)}
                </Paper>
                <Flexbox flexGrow={1}/>
            </Flexbox>);
    }
}
const mapStateToProps = (state) => ({
    adminReducer: state.adminReducer,
    userReducer: state.userReducer,
    teamReducer: state.teamReducer
});
export var ManageOrgChartBox = connect(mapStateToProps)(OrgChartBox);
ManageOrgChartBox = withRouter(ManageOrgChartBox);
