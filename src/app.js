const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var path = require('path')
app.use(express.json())


const router = require('./routes/router.js')

app.use('/api/patient',router)

app.listen(3000, () => {
    console.log("demo is listening on port 3000!")
})