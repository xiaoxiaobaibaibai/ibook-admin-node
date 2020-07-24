const crypto = require('crypto')
const { PRIVATE_KEY} = require('../utils/constant')
const jwt = require('jsonwebtoken')
function md5(s) {
    return crypto.createHash('md5')
        .update(String(s)).digest('hex');
}

module.exports = {
    md5,
    decode
}

function decode(req) {
    let token = req.get('Authorization')
    if (token.indexOf('Bearer') === 0) {
        token = token.replace('Bearer ', '')
    }
    return jwt.verify(token, PRIVATE_KEY)
}
