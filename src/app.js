const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var path = require('path')
app.use(express.json())


const router = require('./routes/router.js')

app.use('/patient',router)

app.listen(port , ()=> console.log('> Server is up and running on http://localhost:' + port))