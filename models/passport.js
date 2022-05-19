const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Patient } = require('./db.js')
const { Clinician } = require('./db.js')

// Updated serialize/deserialize functions
passport.serializeUser((user, done) => {
    // console.log(user)
    done(undefined, {_id:user._id, role:user.role})
})

passport.deserializeUser((login, done) => {
    // console.log(login)
    if(login.role === "patient"){
        Patient.findById(login._id, { password: 0 }, (err, user) => {
            if (err) {
                return done(err, undefined)
            }
            return done(undefined, user)
        })
    }else if (login.role === "clinician"){
        Clinician.findById(login._id, { password: 0 }, (err, user) => {
            if (err) {
                return done(err, undefined)
            }
            return done(undefined, user)
        })
    }else{
        return done("no role found", undefined)
    }


})

// Set up "local" strategy, i.e. authentication based on username/password. There are other types of strategy too.

var patientStrategy = new LocalStrategy((username, password, cb) => {
    // first, check if there is a user in the db with this username
    Patient.findOne({ username: username }, {}, {}, (err, user) => {
        console.log('patientStrategy')
        if (err) {
            return cb(null, false, { message: 'Unknown error.' })
        }
        if (!user) {
            console.log('no user')
            return cb(null, false, { message: 'Incorrect username or password' })
        }
        // if there is a user with this username, check if the password matches
        console.log('yes user')
        user.verifyPassword(password, (err, valid) => {
            if (err) {
                return cb(null, false, { message: 'Unknown error.' })
            }
            if (!valid) {
                console.log('no pw')
                return cb(null, false, { message: 'Incorrect username or password' })
            }
            console.log('success')
            return cb(null, user)
        })
    })
})
var clinicianStrategy = new LocalStrategy((username, password, cb) => {
    // first, check if there is a user in the db with this username
    Clinician.findOne({ username: username }, {}, {}, (err, user) => {
        console.log('clinicianStrategy')
        if (err) {
            return cb(null, false, { message: 'Incorrect username or password' })
        }
        if (!user) {
            console.log('no user')
            return cb(null, false, { message: 'Incorrect username or password' })
        }
        // if there is a user with this username, check if the password matches
        console.log('yes user')
        user.verifyPassword(password, (err, valid) => {
            if (err) {
                return cb(null, false, { message: 'Incorrect username or password' })
            }
            if (!valid) {
                console.log('no pw')
                return cb(null, false, { message: 'Incorrect username or password' })
            }
            console.log('success')
            return cb(null, user)
        })
    })
})

passport.use("patient-login",patientStrategy)
passport.use("clinician-login",clinicianStrategy)

module.exports = passport
