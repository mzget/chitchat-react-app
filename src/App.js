import React, { Component } from 'react';
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import logo from './logo.svg';
import './App.css';
import Home from "./containers/Home";
import Chat from "./containers/Chat";

class App extends Component {
    constructor(props) {
        super(props);
        console.log(global.userAgent);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <Home {...this.props} />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}
function mapDispatchToProps(dispatch) {
    const creators = Map()
        .merge()
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
