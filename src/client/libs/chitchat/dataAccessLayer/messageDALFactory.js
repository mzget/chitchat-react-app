/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */
/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */ export default class MessageDALFactory {
    static getObject() {
        console.log(global.userAgent);
        if (!!global.userAgent) {
            const { MessageDAL } = require("./messageDAL");
            return new MessageDAL();
        }
        else {
        }
    }
}
