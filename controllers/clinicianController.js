const { Clinician } = require('../models/db.js')
const { Patient } = require('../models/db.js')
const patientController = require('../controllers/patientController')

const findAll = async (req, res) => {
    result = await Clinician.find()
    res.send(result)
}

const findOneById = async (req, res) => {
    result = await Clinician.findOne({ username: req.params.username }, {})
    res.send(result)
}

const addOne = async (req, res) => {
    console.log('adding clinician')
    const newClinician = new Clinician()
    Object.assign(newClinician, req.body)
    await newClinician
        .save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const editOne = async (req, res) => {
    console.log('editing clinician ' + req.params.username)
    clinician = await Clinician.findOne({ username: req.params.username }, {})
    if (!clinician) {
        res.status(404).send('clinician not found')
        return
    }
    Object.assign(clinician, req.body)
    await clinician
        .save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const deleteOne = async (req, res) => {
    result = await Clinician.findOne({ username: req.params.username }, {})
    if (!result) {
        res.status(404).send('clinician not found')
        return
    }
    console.log('deleting clinician ' + req.params.username)
    await Clinician.deleteOne({ username: req.params.username }, {})
    result = await Clinician.find()
    res.send(result)
}

const renderRegister = (req,res)=>{
    res.render('register.hbs',{
        style:'login.css'
    })
}

const register = async (req, res) => {
    // find if the patient already exists
    if (await Patient.findOne({ username: req.body.username }, {})) {
        return res.render("register.hbs", { registerUsernameExists: true })
    }

    // add new patient
    const newPatient = patientController.addOne(req, res)

    // insert patient into clinician's patientList
    const clinicianId = "6278be431a5d6d69ba56a707"
    const clinician = await Clinician.findOne({ _id: clinicianId }, {})
    clinician.patients.push({ patientId: newPatient._id });
    await clinician.save()
  
    return res.render("register.hbs", { registerSuccess: true })
}

module.exports = {
    findAll,
    findOneById,
    addOne,
    editOne,
    deleteOne,
    renderRegister,
    register,
}