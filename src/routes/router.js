const express = require('express') 
// create our Router object 
const router = express.Router() 
// import demo controller functions 
const patientController = require('../controllers/patientController') 
// add a route to handle the GET request for all demo data 
router.get('/findAll', patientController.findAll) 
// add a route to handle the GET request for one data instance 
router.get('/findOne/:username', patientController.findOneById) 

router.post('/addOne',patientController.addOne)

router.put('/editOne/:username', patientController.editOne)

router.delete('/deleteOne/:username', patientController.deleteOne)


// export the router 
module.exports = router 