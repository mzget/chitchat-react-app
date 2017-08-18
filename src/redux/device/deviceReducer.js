import { Record } from 'immutable';
import { DeviceActionsType } from "./deviceActions";
export const DeviceInitialState = Record({
    isMobile: false,
    platform: '',
    version: null,
    appState: null,
    netState: null,
    deviceToken: null,
    os: null,
    state: null
});
const initialState = new DeviceInitialState;
export function deviceReducer(state = initialState, action) {
    if (!(state instanceof DeviceInitialState))
        return initialState.merge(state);
    switch (action.type) {
        case DeviceActionsType.SET_PLATFORM: {
            const platform = action.payload;
            return state.set('platform', platform);
        }
        case DeviceActionsType.SET_VERSION: {
            const version = action.payload;
            return state.set('version', version);
        }
        case DeviceActionsType.SET_APPSTATE: {
            const appState = action.payload;
            return state.set('appState', appState);
        }
        case DeviceActionsType.SET_NETSTATE: {
            const payload = action.payload;
            return state.set("netState", payload);
        }
        case DeviceActionsType.GET_DEVICETOKEN_SUCCESS: {
            const tokenData = action.payload;
            if (tokenData != null) {
                let deviceToken = tokenData.token;
                let os = tokenData.os;
                return state.set("deviceToken", deviceToken)
                    .set("os", os)
                    .set("state", DeviceActionsType.GET_DEVICETOKEN_SUCCESS);
            }
            else
                return state.set("state", DeviceActionsType.GET_DEVICETOKEN_SUCCESS);
        }
        default:
            return state;
    }
}
