
const axios = require('axios').default
// axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
axios.defaults.baseURL = 'http://localhost:3000/api'



const welcome =  (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
}



const insert  =(req, res) => {
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
            patientId: '62694cb55403b01e62571abd',
            recordDate: getTime(),
        }

        const status = await axios({
            url: '/record/getRecordStatus',
            data,
            method: 'POST',
        })
        res.render('homepage.hbs', {
            status: status.data,
            style: 'homepage.css',
        })
    } catch (error) {
        console.log(error)
        res.send('404 Error')
    }
}

function getTime() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return year + '-' + month + '-' + day
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
