import AccountService from "./AccountService";
const accountService = new AccountService();


export const checkedCanAccessRoom = (roomId: string, userId: string, callback: (err: Error, res: boolean) => void) => {
    accountService.getRoom(roomId, (err, room) => {
        let result: boolean = false;
        if (err || !room) {
            callback(null, result);
        }
        else {
            result = room.members.some(value => {
                if (value._id === userId) {
                    return true;
                }
            });

            callback(null, result);
        }
    });
}