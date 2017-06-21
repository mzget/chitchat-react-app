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
var GettingStartedGoogleMap = withScriptjs_1["default"](react_google_maps_1.withGoogleMap(function (props) {
    console.log(props.markers);
    return (React.createElement(react_google_maps_1.GoogleMap, { ref: props.onMapLoad, defaultZoom: 12, defaultCenter: props.markers[0].position, onClick: props.onMapClick }, props.markers.map(function (marker, index) { return (React.createElement(react_google_maps_1.Marker, __assign({}, marker))); })));
}));
var MapBox = (function (_super) {
    __extends(MapBox, _super);
    function MapBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapBox.prototype.componentWillMount = function () {
        this.state = {
            markers: [{
                    position: {
                        lat: 0,
                        lng: 0
                    },
                    key: "",
                    defaultAnimation: 2
                }],
            mapReady: false
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);
        this.geoError = this.geoError.bind(this);
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    };
    MapBox.prototype.geoSuccess = function (position) {
        var _this = this;
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var _markers = this.state.markers;
        _markers[0].position = { lat: latitude, lng: longitude };
        this.setState(function (prev) { return (__assign({}, prev, { mapReady: true, markers: _markers })); }, function () { console.log(_this.state); });
    };
    MapBox.prototype.geoError = function () {
        console.log("Unable to retrieve your location");
    };
    MapBox.prototype.handleMapLoad = function (map) {
        this._mapComponent = map;
    };
    MapBox.prototype.handleMapClick = function (event) {
        var _markers = this.state.markers;
        _markers[0].position = event.latLng;
        _markers[0].key = Date.now();
        this.setState({
            markers: _markers
        });
    };
    MapBox.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", { id: "map" }, (this.state.mapReady) ? (React.createElement(GettingStartedGoogleMap, { googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E", loadingElement: React.createElement("div", { style: { height: "100%" } },
                    React.createElement(CircularProgress_1["default"], null)), containerElement: React.createElement("div", { style: { height: 400, width: 400 } }), mapElement: React.createElement("div", { style: { height: "100%" } }), onMapLoad: this.handleMapLoad, onMapClick: this.handleMapClick, markers: this.state.markers })) : null)));
    };
    return MapBox;
}(React.Component));
exports.MapBox = MapBox;
