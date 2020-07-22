const express = require('express')
const Result = require('../models/Result')
const { login,findUser } = require('../services/user')
const { md5,decode } = require('../utils/index')
const { PWD_SALT,PRIVATE_KEY,JWT_EXPIRED } = require('../utils/constant')
const { body,validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')

const router = express.Router()


router.post('/login',
    [
        body('username').isString().withMessage('username must be String!'),
        body('password').isString().withMessage('password must be String!')
    ],
    function(req, res, next) {
        const err = validationResult(req)
       // console.log(err)
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors
        next(boom.badRequest(msg))
    } else {
        let { username, password} = req.body
        password = md5(`${password}${PWD_SALT}`)

        login(username, password).then(username => {
            if (!username || username.length === 0) {
                new Result('login fail!').fail(res)
            } else {
                const token = jwt.sign(
                    {username},
                    PRIVATE_KEY,
                    { expiresIn: JWT_EXPIRED }

                )
                new Result({ token },'login success').success(res)
            }

        })
    }
})

router.get('/info', function (req, res) {
    const decoded = decode(req)
    findUser('admin').then(user => {
        console.log(user)
        if (user) {
            user.roles = [user.role]
            new Result(user,'用户信息查询成功').success(res)
        } else {
            new Result('用户信息查询失败').fail(res)
        }

    })

})

module.exports = router
