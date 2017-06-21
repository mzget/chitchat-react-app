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
var SimpleMapExampleGoogleMap = withScriptjs_1["default"](react_google_maps_1.withGoogleMap(function (props) { return (React.createElement(react_google_maps_1.GoogleMap, { defaultZoom: 8, defaultCenter: { lat: -34.397, lng: 150.644 } })); }));
/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
var SimpleMapExample = (function (_super) {
    __extends(SimpleMapExample, _super);
    function SimpleMapExample() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleMapExample.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", null,
                React.createElement(SimpleMapExampleGoogleMap, { googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E", loadingElement: React.createElement("div", { style: { height: "100%" } },
                        React.createElement(CircularProgress_1["default"], null)), containerElement: React.createElement("div", { style: { width: 100, height: 100 } }), mapElement: React.createElement("div", { style: { height: "100%" } }) }))));
    };
    return SimpleMapExample;
}(React.Component));
exports["default"] = SimpleMapExample;
