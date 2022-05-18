const utils = require('../utils/utils.js')
const axios = require('axios').default
const { Record } = require('../models/db.js')
const {Patient} = require('../models/db.js')
// axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
axios.defaults.baseURL = 'http://localhost:3000/api'

const welcome = (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
}
//Here is the function to get the latest data
const insert = async (req, res) => {
    //const userID = req.session.passport ? req.session.passport.user : ''
    const userID = req.user._id
    // const update_time = req.user.records[0].recordDate
    //console.log("222")
    //console.log("patient id" + req.user._id)
    //console.log(req.user.records[0].recordDate)
    //console.log(utils.getMelbDate())
    //console.log(utils.getMelbDateTime())

    const record = await axios({
        url: '/record/getOneRecord',
        method: 'POST',
        data: {
            patientId: userID,
            // patientId: '62779e55ef8bd14bb5143922',
            //recordDate: utils.getMelbDateTime(),
            recordDate : utils.getMelbDate(),
            //recordDate : update_time,
        },
    })

    const {
        data
    } = record.data
    console.log(data);
    //if no data
    let state = {
        glucose: 'show',
        weight: 'show',
        insulin: 'show',
        exercise: 'show',
    }
    //if the status is NO NEED, we hidden that entry
    if (data) {
        state = {
            glucose: data.glucose && data.glucose.status == "NO_NEED" ? 'hidden' : 'show',
            weight: data.weight && data.weight.status == "NO_NEED" ? 'hidden' : 'show',
            insulin: data.insulin && data.insulin.status == "NO_NEED" ? 'hidden' : 'show',
            exercise: data.exercise && data.exercise.status == "NO_NEED" ? 'hidden' : 'show',
        }
    }
    res.render('insert.hbs', {
        style: 'insert.css',
        record: data,
        state,
        userID
    })
}
function fomatFloat(src,pos){

    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
    
    }

const leaderboard = async (req, res) => {
    try {
        //console.log(utils.getMelbDate())
        //console.log(utils.getMelbDateTime())
        //log in this user_id
        //const userID = req.session.passport ? req.session.passport.user : ''
        const userID = req.user._id

        // send request
        const patient = await axios({
            url: '/patient/getEngagement',
            methods: "post",
        })
        //Array to store temp data
        let tempList = []
        //Array to render data list
        let list = []
        //current user info
        let activeUserInfo = {}
        // count the num of users
        let userCount = 0
        if (patient.data) {
            // { username: 'chris123', rate: 1 },
            userCount = patient.data.length
            //Get current user info
            tempList = patient.data
                .sort((a, b) => {
                    if (a.rate == b.rate) {
                        return a.rate - b.rate
                    }
                    return b.rate - a.rate
                })
            //reset the rank info
            for (let n = 0; n < tempList.length; n++) {
                //Set the default ranking attribute, the information of the
                //first object starts from 1 by default, and the subsequent ones increase in turn
                tempList[n].rank = n == 0 ? 1 : tempList[n - 1].rank + 1
                //Judge if it is not the first object
                if (n != 0) {
                    //last user info
                    let a = tempList[n - 1]
                    //current user info
                    let b = tempList[n]
                    //Determine whether the current and previous information rates are equal, 
                    //if they are equal, set the same ranking
                    if (a.rate == b.rate) {
                        b.rank = a.rank
                    }
                }

                //extract the users whose engagement rate is greater than or equal to 0.8
                if (tempList[n].rate >= 0.8) {
                    list.push(tempList[n])
                }
                // rate* 100
                //console.log(tempList[n].rate);
                tempList[n].rate =  tempList[n].rate*100
                tempList[n].rate = fomatFloat(tempList[n].rate,0)
                console.log(tempList[n].username,tempList[n].rate);
                //Judging that the user id cannot be empty and the user
                // id must be the same as an item in the loop,
                if (tempList[n]._id == userID && userID) {
                    //Assign to the current user object
                    activeUserInfo = {
                        ...tempList[n],
                        show: tempList[n].rate >= 80 ? "" : "hide"
                    }
                }
            }

        }
        res.render('leaderboard.hbs', {
            style: 'leaderboard.css',
            //the list need to render
            list,
            //that user rank
            activeUserInfo,
            // total number of users
            userCount
        })
    } catch (err) {
        console.log(err);
    }
}

const login = (req, res) => {
    res.render('login.hbs', {
        style: 'login.css',
    })
}

const logout = (req, res) => {
    req.logout()
    res.redirect("/login")
}

const aboutweb = (req, res) => {
    res.render('aboutweb.hbs', {
        style: 'about.css',
        loggedin: req.isAuthenticated()
    })
}

const aboutweb2 = (req, res) => {
    res.render('aboutweb2.hbs', {
        style: 'about.css',
    })
}

const aboutdia = (req, res) => {
    res.render('aboutdia.hbs', {
        style: 'about.css',
    })
}

const aboutdia2 = (req, res) => {
    res.render('aboutdia2.hbs', {
        style: 'about.css',
    })
}

const homepage = async (req, res) => {
    try {
        const data = {
            patientId: req.user._id,
            recordDate: utils.getMelbDate(),
        }
        const userID = req.user._id

        const status = await axios({
            url: '/record/getRecordStatus',
            data,
            method: 'POST',
        })
        const patient = await axios({
            url: '/patient/getEngagement',
            methods: "POST",
        })
        let renderMedal = {}
        let tempList = []
        if (patient.data) {
            userCount = patient.data.length
            tempList = patient.data
                .sort((a, b) => {
                    if (a.rate == b.rate) {
                        return a.rate - b.rate
                    }
                    return b.rate - a.rate
                })
            for (let n = 0; n < tempList.length; n++) {
                tempList[n].rank = n == 0 ? 1 : tempList[n - 1].rank + 1
                if (n != 0) {
                    let a = tempList[n - 1]
                    let b = tempList[n]
                    if (a.rate == b.rate) {
                        b.rank = a.rank
                    }
                }
                tempList[n].rate =  tempList[n].rate*100
                tempList[n].rate = fomatFloat(tempList[n].rate,0)
                if (tempList[n]._id == userID && userID) {
                    renderMedal = {
                        show: tempList[n].rate >= 80 ? "" : "hide"
                    }
                }
            }
        }
        res.render('homepage.hbs', {
            status: status.data,
            name: req.user.name,
            renderMedal,
            supportMSG: req.user.supportMSG,
            style: 'homepage.css',
        })
    } catch (error) {
        console.log(error)
        res.send('404 Error')
    }
}

const profile = async (req, res) => {
    try {
        const patient = await Patient.findOne({_id: req.user._id}).lean()
        return res.render('p_profile.hbs', {
            style: 'profile.css',
            title: 'Profile',
            patient: patient

        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

const renderEdit = (req, res) => {
    res.render('edit.hbs',{
        style: 'profile.css',
    }
    
    )
}
const edit = async (req, res) => {
    if (await Patient.findOne({ username: req.body.username }, {})) {
        return res.render('register.hbs', { 
            style: 'profile.css',
            usernameExists: true 
        })
    }

    try {
        const patientId = req.session.passport ? req.session.passport.user : ''
        const patient = await Patient.findById(patientId)

        if (req.body.username) {
            patient.username = req.body.username
        }
        if (req.body.yob) {
            patient.yob = req.body.yob
        }
        if (req.body.email) {
            patient.email = req.body.email
        }
        if (req.body.address) {
            patient.address = req.body.address
        }
        if (req.body.phone) {
            patient.phone = req.body.phone
        }
        if (req.body.passward) {
            patient.passward = req.body.passward
        }
        
        await patient.save()
        return res.render('edit.hbs',  { 
            editSuccess: true,
            style: 'profile.css'
        }) 
    } catch (err) {
        console.log(err)
        res.send(err)
        return res.render('edit.hbs', { 
            editFailure: true,
            style: 'profile.css'
        })
    }
}


const table = async(req, res) => {
    try{
        const table = await Record.find({patientId: req.user._id}).lean()
        const patient =  await Patient.findOne({_id: req.user._id}).lean()
        console.log(patient.username)     
        console.log(req.user._id)   
        for (var record of table) {

            // date formatting
            var d = record.recordDate
            var date = d.getUTCDate();
            var y = d.getFullYear();
            var m = d.getMonth();
            var monthArr = ["Jan.", "Feb.","Mar.", "Apr.", "May", "Jun.", "Jul.","Aug.", "Sep.", "Oct.", "Nov.","Dec."];
            m = monthArr[m];
            tableDate = m + "/" + date + "/" + y
            //console.log(tableDate);
            record.recordDate = tableDate


            // indentify alert data
            var glucose = record.data.glucose.data
            var glucoseStatus = record.data.glucose.status
            var thresholdGlucose = patient.thresholdGlucose

            if (glucoseStatus == 'RECORDED' &&
                (glucose < thresholdGlucose * 0.9 ||
                    glucose > thresholdGlucose * 1.1)
            ) {
                record.data.glucose.status = 'ALERT'
            }

            var weight = record.data.weight.data
            var weightStatus = record.data.weight.status
            var thresholdWeight = patient.thresholdWeight

            if (weightStatus == 'RECORDED' &&
                (weight < thresholdWeight * 0.9 || weight > thresholdWeight * 1.1)
            ) {
                record.data.weight.status = 'ALERT'
            }

            var insulin = record.data.insulin.data
            var insulinStatus = record.data.insulin.status
            var thresholdInsulin = patient.thresholdInsulin

            if (insulinStatus == 'RECORDED' &&
                (insulin < thresholdInsulin * 0.9 ||
                    insulin > thresholdInsulin * 1.1)
            ) {
                record.data.insulin.status = 'ALERT'
            }

            var exercise = record.data.exercise.data
            var exerciseStatus = record.data.exercise.status
            var thresholdExecrise = patient.thresholdExecrise

            if (exerciseStatus == 'RECORDED' &&
                (exercise < thresholdExecrise * 0.9 ||
                    exercise > thresholdExecrise * 1.1)
            ) {
                record.data.exercise.status = 'ALERT'
            }

        }
        res.render('table.hbs', {
            style: 'table.css',
            title: "Viewing data",
            record: table.reverse(),
            name: patient.username
        })
    }catch(err){
        console.log(err)
        //res.redirect('/login')
    }
}


module.exports = {
    welcome,
    insert,
    login,
    aboutweb,
    aboutweb2,
    aboutdia,
    aboutdia2,
    homepage,
    leaderboard,
    table,
    logout,
    profile,
    renderEdit,
    edit,
}