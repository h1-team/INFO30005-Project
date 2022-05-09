const utils = require('../utils/utils.js')
const axios = require('axios').default
// axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
axios.defaults.baseURL = 'http://localhost:3000/api'



const welcome =  (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
}

const insert = async (req, res) => {
    const record = await axios({
        url: '/record/getOneRecord',
        method: 'POST',
        data: {
            patientId: '62779e55ef8bd14bb5143922',
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
        state
    })
}


const leaderboard = async (req, res) => {
    const patient = await axios({
        url: '/patient/getEngagement',
        methods: "post",
    })

    console.log(patient.data);
    //create a list to store rank
    let list = []
    // count the num of users
    let userCount = 0
    if (patient.data) {
        // { username: 'chris123', rate: 1 },
        userCount = patient.data.length
        list = patient.data
            //filter the engagement rate which is greater than or equal to 0.8 
            .filter(item => item.rate >= 0.8)
            // then sort the list, only get five users 
            .sort((a, b) => b - a).splice(0,5)
        //present the rank
        list.forEach((item, index) => {
            item.ranke = index + 1
            item.rate *= 100
        })
    }
    res.render('leaderboard.hbs', {
        style: 'leaderboard.css',
        list,
        //that user engagement rate
        thisRate: 60,
        //that user rank
        thisRank: 1,
        // total number of users
        userCount
    })
}

const login = (req, res) => {
    res.render('login.hbs', {
        style: 'login.css',
    })
}


const aboutweb = (req, res) => {
    res.render('aboutweb.hbs', {
        style: 'about.css',
    })
}

const aboutweb2 =  (req, res) => {
    res.render('aboutweb2.hbs', {
        style: 'about.css',
    })
}

const aboutdia =  (req, res) => {
    res.render('aboutdia.hbs', {
        style: 'about.css',
    })
}

const aboutdia2 =  (req, res) => {
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
            name:req.user.name,
            style: 'homepage.css',
        })
    } catch (error) {
        console.log(error)
        res.send('404 Error')
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
    leaderboard
}
