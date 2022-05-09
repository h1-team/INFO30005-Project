const express = require('express')
const homeRouter = express.Router()
const patientController = require('../controllers/patientController')
const homeController = require('../controllers/homeController')
const passport = require('../models/passport.js')

homeRouter.use(passport.authenticate('session'))
// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        console.log("not auth\n")
        return res.redirect('/login')
    }
    
    // Otherwise, proceed to next middleware function
    console.log("yes auth\n")
    return next()
}



homeRouter.get('/', homeController.welcome)
// turn on after finsih login
homeRouter.get('/insert',homeController.insert)
//homeRouter.get('/insert', homeController.insert)

homeRouter.get('/leaderboard', homeController.leaderboard)

homeRouter.get('/login', homeController.login)

homeRouter.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  // if bad login, send user back to login page
    (req, res) => { 
        res.redirect('/homepage')  // login was successful, send user to home page
    }   
)

homeRouter.get('/aboutweb', homeController.aboutweb)

homeRouter.get('/aboutweb2', homeController.aboutweb2)

homeRouter.get('/aboutdia', homeController.aboutdia)

homeRouter.get('/aboutdia2', homeController.aboutdia2)

// turn on after finsih login
homeRouter.get('/homepage', isAuthenticated, homeController.homepage)
//homeRouter.get('/homepage', homeController.homepage)

homeRouter.get('/dashboard', patientController.getAllPatientRecordToday)
homeRouter.get('/register', homeController.register)
module.exports = homeRouter