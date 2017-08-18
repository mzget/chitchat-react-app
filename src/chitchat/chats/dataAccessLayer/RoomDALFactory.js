export class RoomDALFactory {
    static getObject() {
        if (!!global.userAgent) {
            const { RoomDAL } = require("./RoomDAL");
            return new RoomDAL();
        }
        else {
        }
    }
}
