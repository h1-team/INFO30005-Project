const exphbs = require('express-handlebars')
// link to the router
const router = require('./routes/router.js')
const recordRouter = require('./routes/recordRouter.js')
const patientController = require('./controllers/patientController')
const homepage =  require('./public/js/homepage.js')
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
app.use('/api/patient', router)
// the record routes are added to the end of the '/record' path
app.use('/api/record', recordRouter)
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
})

app.get('/insert', (req, res) => {
    res.render('insert.hbs', {
        style: 'insert.css',
    })
})

app.get('/login', (req, res) => {
    res.render('login.hbs', {
        style: 'login.css',
    })
})

app.get('/aboutweb', (req, res) => {
    res.render('aboutweb.hbs', {
        style: 'about.css',
    })
})
app.get('/aboutweb2', (req, res) => {
    res.render('aboutweb2.hbs', {
        style: 'about.css',
    })
})

app.get('/aboutdia', (req, res) => {
    res.render('aboutdia.hbs', {
        style: 'about.css',
    })
})

app.get('/aboutdia2', (req, res) => {
    res.render('aboutdia2.hbs', {
        style: 'about.css',
    })
})

app.get('/homepage', async (req, res) => {
    homepage.getStatus(res)
})

app.get('/dashboard', patientController.getAllPatientRecordToday)

app.listen(process.env.PORT || 3000, () => {
    console.log('demo is listening on port 3000!')
})
