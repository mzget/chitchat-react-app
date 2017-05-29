"use strict";
var SecureService = (function () {
    function SecureService() {
        this.key = "CHITCHAT!@#$%^&*()_+|===";
        this.passiv = "ThisIsUrPassword";
    }
    SecureService.prototype.hashCompute = function (content, callback) {
        require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
            var hash = CryptoJS.MD5(content);
            var md = hash.toString(CryptoJS.enc.Hex);
            callback(null, md);
        });
    };
    SecureService.prototype.encryption = function (content, callback) {
        var self = this;
        require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
            var ciphertext = CryptoJS.AES.encrypt(content, self.key);
            callback(null, ciphertext.toString());
        });
    };
    SecureService.prototype.decryption = function (content, callback) {
        var self = this;
        require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
            //   var words = CryptoJS.enc.Base64.parse(content);
            var bytes = CryptoJS.AES.decrypt(content, self.key);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            callback(null, plaintext);
        });
    };
    SecureService.prototype.encryptWithSecureRandom = function (content, callback) {
        var self = this;
        require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
            var key = CryptoJS.enc.Utf8.parse(self.key);
            var iv = CryptoJS.enc.Utf8.parse(self.passiv);
            var ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
            callback(null, ciphertext.toString());
        });
    };
    SecureService.prototype.decryptWithSecureRandom = function (content, callback) {
        var self = this;
        require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
            var key = CryptoJS.enc.Utf8.parse(self.key);
            var iv = CryptoJS.enc.Utf8.parse(self.passiv);
            var bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
            var plaintext;
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
        });
    };
    return SecureService;
}());
