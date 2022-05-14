const exphbs = require('express-handlebars')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var path = require('path')
const flash = require('express-flash')
const homeRouter = require('./routes/homeRouter.js')
const session = require('express-session')
const clinicianRouter = require('./routes/clinicianRouter.js')
const patientRouter = require('./routes/patientRouter.js')
const recordRouter = require('./routes/recordRouter.js')

// connect to MongoDB
require('./models/index.js')
app.use(flash())
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'bad-designers',
        name: 'bad-designers', // The cookie name
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', // to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 300000, // sessions expire after 5 minutes
        },
    })
)

// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers: {
            isrecord: a => a == "RECORDED",
            isunrecord: a => a == "UNRECORDED",
            isnoneed: a => a == "NO_NEED",
            isalert: a => a == "ALERT"
        }
    })
)
app.get('/clinical_notes',(req,res)=>{
    res.render('clinical_note.hbs',{
        style:'clinical_note.css'
    })
})
// set Handlebars view engine
app.set('view engine', 'hbs')
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input
app.use(express.static('./public'))

app.use('/', homeRouter)
app.use('/api/clinician', clinicianRouter)
app.use('/api/patient', patientRouter)
app.use('/api/record', recordRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log('demo is listening on port 3000!')
})