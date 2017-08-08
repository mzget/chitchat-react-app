/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */

const REACT_NATIVE = "react-native";
const REACTJS = "react-js";

export class MessageDALFactory {
    static async getObject() {
        console.log("userAgent", global["userAgent"]);

        if (!!global["userAgent"] && global["userAgent"] === REACTJS) {
            const { MessageDAL_Web } = await import("./messageDAL");
            return new MessageDAL_Web();
        }
        else if (!!global["userAgent"] && global["userAgent"] === REACT_NATIVE) {
            // const { NodeMessageDAL } = require("./nodeMessageDAL");
            // return new NodeMessageDAL();
        }
    }
}
