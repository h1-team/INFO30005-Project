const express = require('express')
// create our Router object
const recordRouter = express.Router()
// import demo controller functions
const recordController = require('../controllers/recordController')

recordRouter.get('/recordData', recordController.renderRecordData)
recordRouter.post('/updateData', recordController.updateRecord)
recordRouter.get('/findAllRecord', recordController.findAll)

// export the router
module.exports = recordRouter
