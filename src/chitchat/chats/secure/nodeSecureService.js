"use strict";
var CryptoJS = require("crypto-js");
var NodeSecureService = (function () {
    function NodeSecureService() {
        this.key = "CHITCHAT!@#$%^&*()_+|===";
        this.passiv = "ThisIsUrPassword";
    }
    NodeSecureService.prototype.hashCompute = function (content, callback) {
        var hash = CryptoJS.MD5(content);
        callback(null, hash.toString());
    };
    NodeSecureService.prototype.encryption = function (content) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var ciphertext = CryptoJS.AES.encrypt(content, self.key);
            if (!!ciphertext) {
                resolve(ciphertext.toString());
            }
            else
                reject();
        });
    };
    NodeSecureService.prototype.decryption = function (content) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var bytes = CryptoJS.AES.decrypt(content, self.key);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            if (!!plaintext)
                resolve(plaintext);
            else
                reject();
        });
    };
    NodeSecureService.prototype.encryptWithSecureRandom = function (content, callback) {
        var self = this;
        var key = CryptoJS.enc.Utf8.parse(self.key);
        var iv = CryptoJS.enc.Utf8.parse(self.passiv);
        var ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
        callback(null, ciphertext.toString());
    };
    NodeSecureService.prototype.decryptWithSecureRandom = function (content) {
        var self = this;
        return new Promise(function (resolve, rejected) {
            var key = CryptoJS.enc.Utf8.parse(self.key);
            var iv = CryptoJS.enc.Utf8.parse(self.passiv);
            var bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
            console.log(key, iv, bytes, content);
            try {
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                resolve(plaintext);
            }
            catch (e) {
                console.error(e);
                rejected(e);
            }
        });
    };
    return NodeSecureService;
}());
exports.__esModule = true;
exports["default"] = NodeSecureService;
