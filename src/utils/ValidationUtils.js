"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = require("validate.js");
function validateEmailPass(_email, _password, callback) {
    const constraints = {
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
    const _constraints = {
        email: {
            email: true,
            presence: true
        }
    };
    callback(validate({ email: _email }, _constraints));
}
exports.validateEmail = validateEmail;
