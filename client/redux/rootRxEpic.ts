import { combineEpics } from 'redux-observable';

import * as authActions from "./auth/authActions";

export const rootEpic = combineEpics(
    authActions.fetchUserEpic
);