const exphbs = require('express-handlebars')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
var path = require('path')
const homeRouter = require('./routes/homeRouter.js')
const router = require('./routes/router.js')
const recordRouter = require('./routes/recordRouter.js')
// connect to MongoDB
require('./models/index.js')

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
    app.use(express.json()) // needed if POST data is in JSON format
    app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input
    app.use(express.static('./public'))

app.use('/',homeRouter)

app.use('/api/patient', router)
// the record routes are added to the end of the '/record' path
app.use('/api/record', recordRouter)

app.get('/doc_login',(req,res)=>{
    res.render('doc_login.hbs',{
        style:'login.css'
    })
})

app.get('/home',(req,res)=>{
    res.render('home.hbs',{
        style:'doctor.css'
    })
})

app.get('/doctorhome',(req,res)=>{
    res.render('doctor.hbs', {doctor: {  // in this first version of the app we've hard-coded data here - in a later version we'll retrieve it from the database
        'name': 'Alice'
    }})
})

app.listen(process.env.PORT || 3000, () => {
    console.log('demo is listening on port 3000!')
})
