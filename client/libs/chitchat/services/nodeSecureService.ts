const CryptoJS = require('crypto-js');

import { ISecureService } from "./ISecureService";

export default class NodeSecureService implements ISecureService {
    key: string;
    passiv: string;

    constructor() {
        this.key = "CHITCHAT!@#$%^&*()_+|===";
        this.passiv = "ThisIsUrPassword";
    }
    hashCompute(content, callback) {
        let hash = CryptoJS.MD5(content);
        let md = hash.toString(CryptoJS.enc.Hex);
        callback(null, md);
    }
    encryption(content, callback) {
        let self = this;
        let ciphertext = CryptoJS.AES.encrypt(content, self.key);
        callback(null, ciphertext.toString());
    }
    decryption(content, callback) {
        let self = this;
        //   var words = CryptoJS.enc.Base64.parse(content);
        let bytes = CryptoJS.AES.decrypt(content, self.key);
        let plaintext = bytes.toString(CryptoJS.enc.Utf8);
        callback(null, plaintext);
    }
    encryptWithSecureRandom(content, callback) {
        let self = this;
        let key = CryptoJS.enc.Utf8.parse(self.key);
        let iv = CryptoJS.enc.Utf8.parse(self.passiv);
        let ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
        callback(null, ciphertext.toString());
    }
    public decryptWithSecureRandom(content, callback) {
        let self = this;
        let key = CryptoJS.enc.Utf8.parse(self.key);
        let iv = CryptoJS.enc.Utf8.parse(self.passiv);
        let bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
        let plaintext;
        try {
            plaintext = bytes.toString(CryptoJS.enc.Utf8);
        }
        catch (e) {
            console.warn(e);
        }
        if (!!plaintext)
            callback(null, plaintext);
        else
            callback(new Error("cannot decrypt content"), content);
    }
}
