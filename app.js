const express = require('express')
const router = require('./router')
const app = express()

// function myLogger(req, res, next) {
//     console.log('myLogger')
//     next()
// }
//
// app.use(myLogger())

// app.get('/', function (req, res) {
//     res.send('hello node')
//     throw new Error('err')
// })
//
// function errorHandler(err, req, res, next) {
//     console.log(err)
//     res.status(500).json({
//         error: -1,
//         msg: err.toString()
//     })
// }
//
// app.use(errorHandler)

app.use('/', router)

const server = app.listen(5000, function () {
    const { address, port } = server.address()
    console.log('Http Server is running on http://%s%s', address, port)
})
