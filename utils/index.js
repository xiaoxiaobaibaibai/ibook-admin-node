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
    const authorization = req.get('Authorization')
    let token = ''
    if (authorization.indexOf('Bearer') >= 0) {
        token = authorization.replace('Bearer ', '')
    } else {
        token = authorization
    }
    return jwt.verify(token, PRIVATE_KEY)
}
