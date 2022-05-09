const utils = require('../utils/utils.js')
const axios = require('axios').default
// axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
axios.defaults.baseURL = 'http://localhost:3000/api'

const welcome = (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
}

const insert = (req, res) => {
    res.render('insert.hbs', {
        style: 'insert.css',
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

module.exports = {
    welcome,
    insert,
    login,
    aboutweb,
    aboutweb2,
    aboutdia,
    aboutdia2,
    homepage,
}
