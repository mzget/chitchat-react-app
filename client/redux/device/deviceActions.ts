/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
/**
 * # deviceActions.js
 * 
 * What platform are we running on, ie ```ios``` or ```android```
 *
 * What version is the app?
 * 
 */

// import NotificationManager from '../../chats/notificationManager';

export class DeviceActionsType {
  static SET_PLATFORM = "SET_PLATFORM";
  static SET_VERSION = "SET_VERSION";
  static SET_APPSTATE = "SET_APPSTATE";
  static SET_NETSTATE = "SET_NETSTATE";

  static GET_DEVICETOKEN_SUCCESS = "GET_DEVICETOKEN_SUCCESS";
}

/**
 * ## Set the platformState 
 *
 */
export function setPlatform(platform) {
  return {
    type: DeviceActionsType.SET_PLATFORM,
    payload: platform
  };
}
/**
 * ## set the version
 *
 */
export function setVersion(version) {
  return {
    type: DeviceActionsType.SET_VERSION,
    payload: version
  };
}

export function setAppState(appState) {
  return {
    type: DeviceActionsType.SET_APPSTATE,
    payload: appState
  };
}

export function setNetState(netState) {
  return {
    type: DeviceActionsType.SET_NETSTATE,
    payload: netState
  }
}


function getDeviceTokenSuccess(deviceToken) {
  return {
    type: DeviceActionsType.GET_DEVICETOKEN_SUCCESS,
    payload: deviceToken
  }
}
export function initNotificationService() {
  return (dispatch) => {
    /*
    NotificationManager.getInstance().init((err, tokenData) => {
      dispatch(getDeviceTokenSuccess(tokenData));
    });

    if (process.env.NODE_ENV === `development`) {
      dispatch(getDeviceTokenSuccess(null));
    }
    */
  }
}
