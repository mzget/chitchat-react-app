"use strict";
exports.__esModule = true;
var validate = require("validate.js");
function validateEmailPass(_email, _password, callback) {
    var constraints = {
        email: {
            email: true,
            presence: true
        },
        password: {
            presence: true,
            length: {
                minimum: 8,
                message: "must be at least 8 characters"
            }
        }
    };
    callback(validate({ email: _email, password: _password }, constraints));
}
exports.validateEmailPass = validateEmailPass;
function validateEmail(_email, callback) {
    var _constraints = {
        email: {
            email: true,
            presence: true
        }
    };
    callback(validate({ email: _email }, _constraints));
}
exports.validateEmail = validateEmail;
