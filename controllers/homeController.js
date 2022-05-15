const utils = require('../utils/utils.js')
const axios = require('axios').default
const { Record } = require('../models/db.js')
//axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
axios.defaults.baseURL = 'http://localhost:3000/api'

const welcome = (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
}

const insert = async (req, res) => {
    const userID = req.session.passport ? req.session.passport.user : ''
    const record = await axios({
        url: '/record/getOneRecord',
        method: 'POST',
        data: {
            patientId: userID,
            // patientId: '62779e55ef8bd14bb5143922',
            recordDate: utils.getMelbDate(),
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
        //log in this user_id
        const userID = req.session.passport ? req.session.passport.user : ''
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

        const status = await axios({
            url: '/record/getRecordStatus',
            data,
            method: 'POST',
        })
        res.render('homepage.hbs', {
            status: status.data,
            name: req.user.name,
            style: 'homepage.css',
        })
    } catch (error) {
        console.log(error)
        res.send('404 Error')
    }
}

const table = async(req, res) => {
    try{
        const table = await Record.find({patientId: '627f68e06aecfbc0f73ac661'}).lean()
        //console.log(table)
        for (var data of table) {
            var d = data.recordDate
            var date = d.getUTCDate();
            var y = d.getFullYear();
            var m = d.getMonth();
            var monthArr = ["Jan.", "Feb.","Mar.", "Apr.", "May", "Jun.", "Jul.","Aug.", "Sep.", "Oct.", "Nov.","Dec."];
            m = monthArr[m];
            tableDate = m + "/" + date + "/" + y
            //console.log(tableDate);
            data.recordDate = tableDate
        }
        res.render('table.hbs', {
            style: 'table.css',
            record: table,
        })
    }catch(err){
        console.log(err)
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
}