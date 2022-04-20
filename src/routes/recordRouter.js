const express = require('express') 
// create our Router object 
const recordRouter = express.Router() 
// import demo controller functions 
const recordController = require('../controllers/recordController') 

recordRouter.get("/asdf", recordController.renderRecordData)
recordRouter.post("/recordData", recordController.updateRecord)
recordRouter.get('/findAll',recordController.findAll)

// export the router 
module.exports = recordRouter 