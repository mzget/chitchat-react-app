const validate = require("validate.js");

export function validateEmailPass(_email: string, _password: string, callback: (result) => void) {
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

export function validateEmail(_email: string, callback: (result) => void) {
    const _constraints = {
        email: {
            email: true,
            presence: true
        }
    };
    callback(validate({ email: _email }, _constraints));
}