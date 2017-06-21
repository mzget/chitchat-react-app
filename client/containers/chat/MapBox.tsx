import * as React from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import CircularProgress from 'material-ui/CircularProgress';

// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// and name it GettingStartedGoogleMap
const GettingStartedGoogleMap = withScriptjs(withGoogleMap(props => {
    console.log(props.markers);
    return (
        <GoogleMap
            ref={props.onMapLoad}
            defaultZoom={12}
            defaultCenter={props.markers[0].position}
            onClick={props.onMapClick}
        >
            {
                props.markers.map((marker, index) => (
                    <Marker
                        {...marker}
                    />
                ))}
        </GoogleMap>
    )
}));


interface IMapBoxProps {
    markers: Array<{ position, key, defaultAnimation }>;
    mapReady: boolean;
}

export class MapBox extends React.Component<any, IMapBoxProps> {

    componentWillMount() {
        this.state = {
            markers: [{
                position: {
                    lat: 0,
                    lng: 0,
                },
                key: "",
                defaultAnimation: 2,
            }],
            mapReady: false
        }

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);
        this.geoError = this.geoError.bind(this);

        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    }

    geoSuccess(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        let _markers = this.state.markers;
        _markers[0].position = { lat: latitude, lng: longitude };
        this.setState(prev => ({ ...prev, mapReady: true, markers: _markers }), () => { console.log(this.state) });
    }

    geoError() {
        console.log("Unable to retrieve your location");
    }


    handleMapLoad(map) {
        this._mapComponent = map;
    }
    handleMapClick(event) {

        let _markers = this.state.markers;
        _markers[0].position = event.latLng;
        _markers[0].key = Date.now();

        this.setState({
            markers: _markers
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div id="map">
                    {
                        (this.state.mapReady) ? (
                            <GettingStartedGoogleMap
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
                                markers={this.state.markers}
                            />) : null
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}