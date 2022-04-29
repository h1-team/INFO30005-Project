const exphbs = require('express-handlebars')
// link to the router
const router = require('./routes/router.js')
const recordRouter = require('./routes/recordRouter.js')
const homeRouter = require('./routes/homeRouter.js')


// connect to MongoDB
require('./models/index.js')
// import express
const express = require('express')
// set the app up as an express app
const app = express()
const axios = require('axios').default
const port = process.env.PORT || 8080
var path = require('path')


// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers: {
            isrecord: (a) => a == 'RECORDED',
            isunrecord: (a) => a == 'UNRECORDED',
            isnoneed: (a) => a == 'NO_NEED',
            isalert: (a) => a == 'ALERT',
        },
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')
// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input
app.use(express.static('./public'))




// the patient routes are added to the end of the '/patient' path
app.use('/', homeRouter)
app.use('/api/patient', router)
// the record routes are added to the end of the '/record' path
app.use('/api/record', recordRouter)


app.listen(process.env.PORT || 3000, () => {
    console.log('demo is listening on port 3000!')
})
