"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
/* global google */
var React = require("react");
var react_google_maps_1 = require("react-google-maps");
var withScriptjs_1 = require("react-google-maps/lib/async/withScriptjs");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var CircularProgress_1 = require("material-ui/CircularProgress");
/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
var SimpleGoogleMap = withScriptjs_1["default"](react_google_maps_1.withGoogleMap(function (props) { return (React.createElement(react_google_maps_1.GoogleMap, { defaultZoom: 15, defaultCenter: props.marker.position }, (props.marker) ? React.createElement(react_google_maps_1.Marker, __assign({}, props.marker)) : null)); }));
/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
var SimpleMapPreview = (function (_super) {
    __extends(SimpleMapPreview, _super);
    function SimpleMapPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleMapPreview.prototype.render = function () {
        console.log(this.props);
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", null,
                React.createElement(SimpleGoogleMap, { googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E", loadingElement: React.createElement("div", { style: { height: "100%" } },
                        React.createElement(CircularProgress_1["default"], null)), containerElement: React.createElement("div", { style: { width: 300, height: 300 } }), mapElement: React.createElement("div", { style: { height: "100%" } }), marker: this.props.marker }))));
    };
    return SimpleMapPreview;
}(React.Component));
exports.SimpleMapPreview = SimpleMapPreview;
