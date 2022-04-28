const exphbs = require('express-handlebars')

// import express
const express = require('express')
// set the app up as an express app
const app = express()

const axios = require('axios').default;

const port = process.env.PORT || 8080
var path = require('path')

// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers:{
            isrecord: a => a == "RECORDED",
            isunrecord: a => a == "UNRECORDED",
            isneed: a => a != "NO_NEED",
            isalert: a => a == "ALERT"
        }
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')
// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input
app.use(express.static('./public'));
// link to the router
const router = require('./routes/router.js')
const recordRouter = require('./routes/recordRouter.js')
const { Patient } = require('./models/db.js')

// the patient routes are added to the end of the '/patient' path
app.use('/api/patient', router)
// the record routes are added to the end of the '/record' path
app.use('/api/record', recordRouter)

// connect to MongoDB
require('./models/index.js')

// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('welcome.hbs',{
        style:'welcome.css'
    })
})

const patientController = require('./controllers/patientController')
app.get('/dashboard',patientController.getAllPatientRecordToday)

app.get('/insert',(req,res)=>{
    res.render('insert.hbs')
})

app.get('/login',(req,res)=>{
    res.render('login.hbs')
})

app.get('/aboutweb',(req,res)=>{
    res.render('aboutweb.hbs',{
        style:'about.css'
    })
})

app.get('/aboutdia',(req,res)=>{
    res.render('aboutdia.hbs',{
        style:'about.css'
    })
})

app.get('/homepage', async(req,res)=>{
    function getTime(){
        var date = new Date();
        var year = date.getFullYear() 
        var month = date.getMonth() +1
        var day = date.getDate()
        if(month<10){
            month = "0" + month
        }
        if(day <10){
            day = "0" +day
        }
        return year + '-' + month + '-' + day
    }

    const data = {
        patientId:"62694cb55403b01e62571abd",
        recordDate: getTime()
    }
    
    async function getStatus(){
        try{const status = await axios({
                url:"http://localhost:3000/api/record/getRecordStatus",
                data,
                method:"POST"
        })
        res.render('homepage.hbs', {
            status: status.data,
            style: "homepage.css"
        })}catch(error){
            console.log(error)
            res.send("404 Error")
        }
    }
      
    getStatus()
})

app.listen(process.env.PORT || 3000, () => {
    console.log('demo is listening on port 3000!')
})
