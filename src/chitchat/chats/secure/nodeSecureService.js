import * as CryptoJS from "crypto-js";
export default class NodeSecureService {
    constructor() {
        this.key = "CHITCHAT!@#$%^&*()_+|===";
        this.passiv = "ThisIsUrPassword";
    }
    hashCompute(content, callback) {
        let hash = CryptoJS.MD5(content);
        callback(null, hash.toString());
    }
    encryption(content) {
        let self = this;
        return new Promise((resolve, reject) => {
            let ciphertext = CryptoJS.AES.encrypt(content, self.key);
            if (!!ciphertext) {
                resolve(ciphertext.toString());
            }
            else
                reject();
        });
    }
    decryption(content) {
        let self = this;
        return new Promise((resolve, reject) => {
            let bytes = CryptoJS.AES.decrypt(content, self.key);
            let plaintext = bytes.toString(CryptoJS.enc.Utf8);
            if (!!plaintext)
                resolve(plaintext);
            else
                reject();
        });
    }
    encryptWithSecureRandom(content, callback) {
        let self = this;
        let key = CryptoJS.enc.Utf8.parse(self.key);
        let iv = CryptoJS.enc.Utf8.parse(self.passiv);
        let ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
        callback(null, ciphertext.toString());
    }
    decryptWithSecureRandom(content) {
        let self = this;
        return new Promise((resolve, rejected) => {
            let key = CryptoJS.enc.Utf8.parse(self.key);
            let iv = CryptoJS.enc.Utf8.parse(self.passiv);
            let bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
            console.log(key, iv, bytes, content);
            try {
                let plaintext = bytes.toString(CryptoJS.enc.Utf8);
                resolve(plaintext);
            }
            catch (e) {
                console.error(e);
                rejected(e);
            }
        });
    }
}
