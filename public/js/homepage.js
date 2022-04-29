const axios = require('axios').default
const exphbs = require('express-handlebars')
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
const data = {
    patientId: '62694cb55403b01e62571abd',
    recordDate: getTime(),
}

axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
async function getStatus(res) {
    try {
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
module.exports = {getStatus}