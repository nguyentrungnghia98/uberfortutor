const jwt = require('jsonwebtoken');

module.exports = {
    generateJWT: (user, secrectKey, expiresIn) => {
        return jwt.sign(user, secrectKey, {
            expiresIn
        });
    },

    decodeJWT: (token, secretKey) => {
        return jwt.decode(token, secretKey);
    },

    verify: (token, secretKey) => {
        return jwt.verify(token, secretKey);
    }
}