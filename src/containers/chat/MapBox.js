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
var React = require("react");
var react_google_maps_1 = require("react-google-maps");
var withScriptjs_1 = require("react-google-maps/lib/async/withScriptjs");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var CircularProgress_1 = require("material-ui/CircularProgress");
// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// and name it GettingStartedGoogleMap
var GettingStartedGoogleMap = withScriptjs_1["default"](react_google_maps_1.withGoogleMap(function (props) { return (React.createElement(react_google_maps_1.GoogleMap, { ref: props.onMapLoad, defaultZoom: 8, defaultCenter: { lat: -25.363882, lng: 131.044922 }, onClick: props.onMapClick }, props.markers.map(function (marker, index) { return (React.createElement(react_google_maps_1.Marker, __assign({}, marker, { onRightClick: function () { return props.onMarkerRightClick(index); } }))); }))); }));
var MapBox = (function (_super) {
    __extends(MapBox, _super);
    function MapBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapBox.prototype.componentWillMount = function () {
        this.state = {
            markers: [{
                    position: {
                        lat: 25.0112183,
                        lng: 121.52067570000001
                    },
                    key: "Taiwan",
                    defaultAnimation: 2
                }]
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    };
    MapBox.prototype.handleMapLoad = function (map) {
        this._mapComponent = map;
        if (map) {
            console.log(map.getZoom());
        }
    };
    MapBox.prototype.handleMapClick = function (event) {
        var nextMarkers = this.state.markers.concat([
            {
                position: event.latLng,
                defaultAnimation: 2,
                key: Date.now()
            },
        ]);
        this.setState({
            markers: nextMarkers
        });
        if (nextMarkers.length === 3) {
            this.props.toast("Right click on the marker to remove it", "Also check the code!");
        }
    };
    MapBox.prototype.handleMarkerRightClick = function (targetMarker) {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        var nextMarkers = this.state.markers.filter(function (marker) { return marker !== targetMarker; });
        this.setState({
            markers: nextMarkers
        });
    };
    MapBox.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", { id: "map" },
                React.createElement(GettingStartedGoogleMap, { googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E", loadingElement: React.createElement("div", { style: { height: "100%" } },
                        React.createElement(CircularProgress_1["default"], null)), containerElement: React.createElement("div", { style: { height: 400, width: 400 } }), mapElement: React.createElement("div", { style: { height: "100%" } }), onMapLoad: this.handleMapLoad, onMapClick: this.handleMapClick, markers: this.state.markers, onMarkerRightClick: this.handleMarkerRightClick }))));
    };
    return MapBox;
}(React.Component));
exports.MapBox = MapBox;
