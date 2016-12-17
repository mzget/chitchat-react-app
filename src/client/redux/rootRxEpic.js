import { combineEpics } from 'redux-observable';
import * as userActions from "./user/userActions";
export const rootEpic = combineEpics(userActions.fetchUserEpic, userActions.fetchContactEpic);
