// import demo model 
const {Patient} = require('../models/db.js')

const findAll =  async (req, res) => {
    result = await Patient.find()
    res.send(result)
}

const findOneById = async (req, res) => {
    result = await Patient.findOne({username:req.params.username},{})
    res.send(result)
}

const addOne = async (req, res) => {
    console.log("adding patient")
    const newPatient = new Patient()
    Object.assign(newPatient,req.body)
    await newPatient.save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const editOne =  async (req, res) => {
    console.log("editing patient " + req.params.username)
    patient = await Patient.findOne({username:req.params.username},{})
    if(!patient){
        res.status(404).send("pateient not found")
        return
    }
    Object.assign(patient,req.body)
    await patient.save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
        
}

const deleteOne = async (req, res) => {
    result = await Patient.findOne({username:req.params.username},{})
    if(!result){
        res.status(404).send("patient not found")
        return
    }
    console.log("deleting patient " + req.params.username)
    await Patient.deleteOne({username:req.params.username},{})
    result = await Patient.find()
    res.send(result)
}

// exports an object, which contains a function named getAllDemoData 
module.exports = { 
    findAll, 
    findOneById,
    addOne,
    editOne,
    deleteOne
} 