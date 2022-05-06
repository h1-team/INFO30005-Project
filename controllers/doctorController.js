const { home } = require("nodemon/lib/utils")

const doctor =  (req, res) => {
    res.render('home.hbs', {
        style: 'doctor.css',
    })
}
const doctor_home =  (req, res) => {
    res.render('doctor.hbs', {
        style: 'doctor.css',
    })
}
module.exports = {
    doctor,
    doctor_home,
}
