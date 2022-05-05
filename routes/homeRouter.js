const express = require('express')
const homepage =  require('../public/js/homepage.js')
const homeRouter = express.Router()
const patientController = require('../controllers/patientController')
const homeController = require('../controllers/homeController')


homeRouter.get('/', homeController.welcome)

homeRouter.get('/insert', homeController.insert)

homeRouter.get('/login', homeController.login)

homeRouter.get('/aboutweb', homeController.aboutweb)

homeRouter.get('/aboutweb2', homeController.aboutweb2)

homeRouter.get('/aboutdia', homeController.aboutdia)

homeRouter.get('/aboutdia2', homeController.aboutdia2)

homeRouter.get('/homepage', async (req, res) => {
    homepage.getStatus(res)
})

homeRouter.get('/dashboard', patientController.getAllPatientRecordToday)

module.exports = homeRouter