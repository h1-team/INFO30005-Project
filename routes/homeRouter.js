const express = require('express')
const homeRouter = express.Router()
const homeController = require('../controllers/homeController')
const passport = require('../models/passport.js')

homeRouter.use(passport.authenticate('session'))
// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    try{
        if (!req.isAuthenticated()) {
            console.log('not auth\n')
            return res.redirect('/login')
        }
        console.log(req.user.role)
        if(req.user.role == "patient"){
        // Otherwise, proceed to next middleware function
            console.log('yes auth\n')
            return next()
        }
        return res.redirect('/login')
    }catch(err){
        res.status(404).send(err)
    }
}

const isLogin = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if(req.isAuthenticated() && req.user.role == "patient"){
        return res.redirect('/homepage')
    }
    return next()
}



homeRouter.get('/', homeController.welcome)
// turn on after finsih login
homeRouter.get('/insert',homeController.insert)
//homeRouter.get('/insert', homeController.insert)

homeRouter.get('/leaderboard', homeController.leaderboard)

homeRouter.get('/login', isLogin, homeController.login)

homeRouter.post(
    '/login',
    passport.authenticate('patient-login', {
        failureRedirect: '/login',
        failureFlash: true,
    }), // if bad login, send user back to login page
    (req, res) => {
        res.redirect('/homepage') // login was successful, send user to home page
    }
)

homeRouter.get('/aboutweb', homeController.aboutweb)

homeRouter.get('/aboutweb2', homeController.aboutweb2)

homeRouter.get('/aboutdia', homeController.aboutdia)

homeRouter.get('/aboutdia2', homeController.aboutdia2)

// turn on after finsih login
homeRouter.get('/homepage', isAuthenticated, homeController.homepage)
// homeRouter.get('/homepage', homeController.homepage)
homeRouter.post('/logout',isAuthenticated,homeController.logout)

homeRouter.get('/table', isAuthenticated,homeController.table)

homeRouter.get('/p_profile', isAuthenticated,homeController.profile)

homeRouter.get('/edit', isAuthenticated,homeController.renderEdit)
homeRouter.post('/edit', isAuthenticated,homeController.edit)

module.exports = homeRouter
