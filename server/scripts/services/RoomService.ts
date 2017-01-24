import AccountService from "./AccountService";
const accountService = new AccountService();


export const checkedCanAccessRoom = (roomId: string, userId: string, callback: (err: Error, res: boolean) => void) => {
    accountService.getRoom(roomId, (err, room) => {
        let result: boolean = false;
        if (err || !room) {
            console.warn("getRoom fail", err);
            callback(null, result);
        }
        else {
            if (room.members === "*") {
                result = true;
            }
            else {
                let members = room.members as Array<any>;
                result = members.some(value => {
                    if (value._id === userId) {
                        return true;
                    }
                });
            }

            callback(null, result);
        }
    });
};