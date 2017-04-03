import { Observable } from "rxjs/Rx";
import { ajax } from "rxjs/observable/dom/ajax";

import Store from "../../../redux/configureStore";
import * as chatlogsActions from "./chatlogsActions";

// epic
// export const stalkInitChatlogs_Epic = (action$) =>
//     action$.ofType(chatlogsActions.STALK_INIT_CHATSLOG)
//         // .delay(1000)
//         .mapTo(() => {
//             let { team } = Store.getState().teamReducer;
//             chatlogsActions.getLastAccessRoom(team._id);
//         });