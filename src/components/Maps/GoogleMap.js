"use strict";
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
// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// and name it GettingStartedGoogleMap
exports.GettingStartedGoogleMap = withScriptjs_1["default"](react_google_maps_1.withGoogleMap(function (props) {
    console.log("GoogleMap", props.marker);
    return (React.createElement(react_google_maps_1.GoogleMap, { ref: props.onMapLoad, defaultZoom: 15, defaultCenter: props.marker.position, onClick: props.onMapClick }, (props.marker) ? React.createElement(react_google_maps_1.Marker, __assign({}, props.marker)) : null));
}));
