const express = require('express')
const router = require('./router')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const cors = require('cors')
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

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use('/', router)

const privateKey = fs.readFileSync('./https/4235134_fdxans.com.key')
const pem = fs.readFileSync('./https/4235134_fdxans.com.pem')

const credentials = {
    key: privateKey,
    cert: pem
}

const  httpsServer = https.createServer(credentials, app)
const server = app.listen(5000, function () {
    const { address, port } = server.address()
    console.log('Http Server is running on http://%s%s', address, port)
})

httpsServer.listen(18082, function () {
    console.log('Https Server is running on http://localhost:%s', 18082)
})
