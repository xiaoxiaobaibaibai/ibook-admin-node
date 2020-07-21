const express = require('express')

const router = express.Router()

router.post('login', function (req, res) {
    console.log(req.body)

    res.json({
        code: 0,
        msg: 'login success'
    })
})

router.get('/info', function(req, res, next) {
    res.json('user info...')
})

router.post('/login', function(req, res, next) {
    console.log('/user/login', req.body)
    res.json({
        code: 0,
        msg: '登录成功'
    })
})

module.exports = router
