import * as AccountService from "./AccountService";
const accountService = new AccountService.AccountService();


export const checkedCanAccessRoom = (roomId: string, userId: string, callback: (err: Error, res: boolean) => void) => {
    AccountService.getRoom(roomId, (err, room) => {
        let result: boolean = false;
        if (err || !room) {
            console.error("getRoom fail", err.message);
            callback(null, result);
        }
        else {
            if (room.members && Array.isArray(room.members)) {
                let members = room.members as Array<any>;
                result = members.some(value => {
                    if (value._id === userId) {
                        return true;
                    }
                });

                callback(null, result);
            }
            else
                callback(null, result);
        }
    });
};