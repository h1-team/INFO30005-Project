const express = require('express')
// create clinician Router object
const clinicianRouter = express.Router()
const passport = require('../models/passport.js')

clinicianRouter.use(passport.authenticate('session'))
// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    try{
        if (!req.isAuthenticated()) {
            console.log('not auth\n')
            return res.redirect('/doctor/login')
        }
        console.log(req.user.role)
        if(req.user.role == "clinician"){
        // Otherwise, proceed to next middleware function
            console.log('yes auth\n')
            return next()
        }
        return res.redirect('/doctor/login')
    }catch(err){
        res.status(404).send(err)
    }
}

const isLogin = (req, res, next) => {
    console.log('y')
    // If user is not authenticated via Passport, redirect to login page
    if(req.isAuthenticated() && req.user.role == "clinician"){
        return res.redirect('/doctor/homepage')
    }
    return next()
}
// import clinician controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

clinicianRouter.get('/findAll', clinicianController.findAll)
clinicianRouter.get('/findOne/:username', clinicianController.findOneById)
clinicianRouter.post('/addOne', clinicianController.addOne)
clinicianRouter.put('/editOne/:username', clinicianController.editOne)
clinicianRouter.delete('/deleteOne/:username', clinicianController.deleteOne)
clinicianRouter.get('/', clinicianController.doctorhome)
clinicianRouter.get('/login', isLogin,clinicianController.doctor_login)

clinicianRouter.post(
    '/login',
    passport.authenticate('clinician-login', {
        failureRedirect: '/doctor/login',
        failureFlash: true,
    }), // if bad login, send user back to login page
    (req, res) => {
        res.redirect('/doctor/homepage') // login was successful, send user to home page
    }
)
clinicianRouter.post('/logout',isAuthenticated,clinicianController.logout)
clinicianRouter.get('/inbox',isAuthenticated,clinicianController.getAllPatientCommentToday)
clinicianRouter.get('/homepage', isAuthenticated, clinicianController.doctor)
clinicianRouter.get('/dashboard', isAuthenticated, patientController.getAllPatientRecordToday)
clinicianRouter.get('/register', isAuthenticated, clinicianController.renderRegister)
clinicianRouter.post('/register', clinicianController.register)
clinicianRouter.get('/table/:_id',isAuthenticated, clinicianController.table)
clinicianRouter.get('/supportMSG', clinicianController.renderSupportMSG)
clinicianRouter.post('/supportMSG', clinicianController.writeSupportMSG)
clinicianRouter.get('/note', clinicianController.renderClinicalNote)
clinicianRouter.get('/comment',clinicianController.comment)
clinicianRouter.get('/profiles/:_id', isAuthenticated, clinicianController.renderOnePatientProfile)

// export the clinician router
module.exports = clinicianRouter
