const express = require('express')
// create our Router object
const patientRouter = express.Router()
// import demo controller functions
const patientController = require('../controllers/patientController')
// add a route to handle the GET request for all demo data
patientRouter.get('/findAll', patientController.findAll)
// add a route to handle the GET request for one data instance
patientRouter.get('/findOne/:id', patientController.findOneById)
patientRouter.get('/getEngagement', patientController.getEngagement)

patientRouter.post('/addOne', patientController.addOne)

patientRouter.get(
    '/getAllPatientRecordToday',
    patientController.getAllPatientRecordToday
)

patientRouter.put('/editOne/:id', patientController.editOne)

patientRouter.delete('/deleteOne/:username', patientController.deleteOne)

// export the router
module.exports = patientRouter
