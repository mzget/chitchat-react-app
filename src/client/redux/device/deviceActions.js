export class DeviceActionsType {
}
DeviceActionsType.SET_PLATFORM = "SET_PLATFORM";
DeviceActionsType.SET_VERSION = "SET_VERSION";
DeviceActionsType.SET_APPSTATE = "SET_APPSTATE";
DeviceActionsType.SET_NETSTATE = "SET_NETSTATE";
DeviceActionsType.GET_DEVICETOKEN_SUCCESS = "GET_DEVICETOKEN_SUCCESS";
export function setPlatform(platform) {
    return {
        type: DeviceActionsType.SET_PLATFORM,
        payload: platform
    };
}
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
    };
}
function getDeviceTokenSuccess(deviceToken) {
    return {
        type: DeviceActionsType.GET_DEVICETOKEN_SUCCESS,
        payload: deviceToken
    };
}
export function initNotificationService() {
    return (dispatch) => {
    };
}
