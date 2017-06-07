"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Subheader_1 = require("material-ui/Subheader");
var colors_1 = require("material-ui/styles/colors");
var renderList = function (props) { return (props.items.map(function (item, i) { return (<div key={i}>
            <List_1.ListItem leftIcon={null} rightIcon={null} primaryText={item.chart_name} secondaryText={<p style={{ color: colors_1.darkBlack }}>{item.chart_description}</p>}/>
        </div>); })); };
exports.OrgChartListView = function (props) { return (<div>
        <Subheader_1.default>Org Charts</Subheader_1.default>
        <List_1.List>
            {(!!props.items) ? renderList(props) : null}
        </List_1.List>
        <Divider_1.default />
    </div>); };
