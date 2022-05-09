const express = require('express')

// create clinician Router object
const clinicianRouter = express.Router()

// import clinician controller functions
const patientController = require('../controllers/patientController')
const clinicianController = require('../controllers/clinicianController')

clinicianRouter.get('/findAll', clinicianController.findAll)
clinicianRouter.get('/findOne/:username', clinicianController.findOneById)
clinicianRouter.post('/addOne', clinicianController.addOne)
clinicianRouter.put('/editOne/:username', clinicianController.editOne)
clinicianRouter.delete('/deleteOne/:username', clinicianController.deleteOne)

clinicianRouter.get('/dashboard', patientController.getAllPatientRecordToday)
clinicianRouter.get('/register', clinicianController.renderRegister)
clinicianRouter.post('/register', clinicianController.register)

// export the clinician router
module.exports = clinicianRouter