// import express
const express = require('express')
// set the app up as an express app
const app = express()

const port = process.env.PORT || 8080
var path = require('path')

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// link to the router
const router = require('./routes/router.js')
const recordRouter = require('./routes/recordRouter.js')

// the patient routes are added to the end of the '/patient' path
app.use('/api/patient', router)
// the record routes are added to the end of the '/record' path
app.use('/api/record', recordRouter)

// connect to MongoDB
require('./models/index.js')

app.listen(process.env.PORT || 3000, () => {
    console.log('demo is listening on port 3000!')
})
