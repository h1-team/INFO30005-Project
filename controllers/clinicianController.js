const { Clinician } = require('../models/db.js')
const { Patient } = require('../models/db.js')
const { Record } = require('../models/db.js')
const patientController = require('../controllers/patientController')
const doctorhome = (req, res) => {
    res.render('home.hbs', {
        style: 'doctor.css',
    })
}
const doctor_login = (req, res) => {
    res.render('doc_login.hbs', {
        style: 'login.css',
    })
}
const doctor = (req, res) => {
    res.render('doctor.hbs', {
        style: 'doctor_home.css',
    })
}
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

const renderRegister = (req, res) => {
    res.render('register.hbs', {
        style: 'login.css',
    })
}

const register = async (req, res) => {
    // find if the patient already exists
    if (await Patient.findOne({ username: req.body.username }, {})) {
        return res.render('register.hbs', { registerUsernameExists: true })
    }

    // add new patient
    const newPatient = new Patient()
    Object.assign(newPatient, req.body)
    await newPatient
        .save()
        .then()
        .catch((err) =>
            res.send(err).render('register.hbs', { registerFailure: true })
        )

    // insert patient into clinician's patientList
    const clinicianId = '62791ae11515ffb0ad2fcf07'
    const clinician = await Clinician.findById(clinicianId)
    clinician.patients.push({ patientId: newPatient._id })
    await clinician.save()

    return res.render('register.hbs', { registerSuccess: true })
}
const clinical_note = async (req, res) => {
    return res.render('clinical_note.hbs')
}
const logout = (req, res) => {
    req.logout()
    res.redirect("/doctor/login")
}
const table = async(req, res) => {
    try{
        const table = await Record.find({patientId: '627f68e06aecfbc0f73ac661'}).lean()
        //console.log(table)
        for (var data of table) {
            var d = data.recordDate
            var date = d.getUTCDate();
            var y = d.getFullYear();
            var m = d.getMonth();
            var monthArr = ["January", "February","March", "April", "May", "June", "July","August", "September", "October", "November","December"];
            m = monthArr[m];
            tableDate = m + "/" + date + "/" + y
            //console.log(tableDate);
            data.recordDate = tableDate
        }
        res.render('check_pat_data.hbs', {
            style: 'table.css',
            record: table,
        })
    }catch(err){
        console.log(err)
    }
}
module.exports = {
    findAll,
    findOneById,
    addOne,
    editOne,
    deleteOne,
    renderRegister,
    register,
    clinical_note,
    doctorhome,
    doctor_login,
    doctor,
    logout,
    table
}
