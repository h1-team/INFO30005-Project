// import demo model 
const {Patient} = require('../models/db.js')


const findAll =  async (req, res) => {
    result = await Patient.find({},{username:true,password:true})
    res.send(result)
}

const findOneById = async (req, res) => {
    result = await Patient.findOne({username:req.params.username},{})
    res.send(result)
}

const addOne = async (req, res) => {
    console.log("adding patient")
    const newPatient = new Patient({
        username: req.body.username,
        password: req.body.password
    })
    await newPatient.save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const editOne =  async (req, res) => {
    console.log("editing patient " + req.params.username)
    await Patient.updateOne({username:req.params.username},{isGlucose:true})
    result = await Patient.findOne({username:req.params.username},{})
    res.send(result)
}

const deleteOne = async (req, res) => {
    console.log("deleting patient " + req.params.username)
    await Patient.deleteOne({username:req.params.username},{})
    result = await Patient.find({},{username:true,password:true})
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