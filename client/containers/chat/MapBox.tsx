import * as React from 'react';
import { withGoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import CircularProgress from 'material-ui/CircularProgress';

import { SimpleGoogleMap } from "../../components/Maps/GoogleMap";

export type Point = { lat, lng };
interface IMapBoxState {
    marker: { position: Point, key, defaultAnimation };
    mapReady: boolean;
}
interface IMapBoxProps {
    onLocationChange: (position: Point) => void;
}

export class MapBox extends React.Component<IMapBoxProps, IMapBoxState> {

    componentWillMount() {
        this.state = {
            marker: {
                position: {
                    lat: 13,
                    lng: 100,
                },
                key: "",
                defaultAnimation: 2,
            },
            mapReady: false
        };

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);
        this.geoError = this.geoError.bind(this);

        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    }

    geoSuccess(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        let _marker = this.state.marker;
        _marker.position = { lat: latitude, lng: longitude };
        this.setState(prev => ({ ...prev, mapReady: true, marker: _marker }),
            () => this.props.onLocationChange(this.state.marker.position)
        );
    }

    geoError() {
        console.error("Unable to retrieve your location");
        alert("Unable to retrieve your location");
    }


    handleMapLoad(map) { }

    handleMapClick(event) {
        let _marker = this.state.marker;
        _marker.position = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        _marker.key = Date.now();

        this.setState({ marker: _marker },
            () => this.props.onLocationChange(this.state.marker.position)
        );
    }

    render() {
        return (
            <MuiThemeProvider>
                <div id="map">
                    {
                        (this.state.mapReady) ? (
                            <SimpleGoogleMap
                                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E"
                                loadingElement={
                                    <div style={{ height: `100%` }}>
                                        <CircularProgress />
                                    </div>
                                }
                                containerElement={
                                    <div style={{ height: 400, width: 400 }} />
                                }
                                mapElement={
                                    <div style={{ height: `100%` }} />
                                }
                                onMapLoad={this.handleMapLoad}
                                onMapClick={this.handleMapClick}
                                marker={this.state.marker}
                            />) : <CircularProgress />
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}