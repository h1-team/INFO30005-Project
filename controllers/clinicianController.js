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

const getAllPatientCommentToday = async (req, res) => {
    result = await Record.find()
    if (!result) {
        res.status(404).send('patient not found')
        return
    }
    var arr = new Array()
    console.log(result.length)
    for (var i = 0; i < result.length; i++) {
        date = Date.now()
        date = formatDate(date)
        //console.log(i)
        var patient = await Patient.findOne({
            _id: result[i].patientId,
        })
        //console.log(patient) 
        if(!patient){
            continue;
        }else{
            var name=patient.name
        }       
        
        const record=result[i]
        var date=record.recordDate
        var glucoseComment=null, weightComment=null, insulinComment=null, exerciseComment=null
            if (record.data.glucose.comment!="") {
                glucoseComment = record.data.glucose.comment
            }
            if ( record.data.exercise.comment!="") {
                exerciseComment = record.data.exercise.comment
            }
            if ( record.data.insulin.comment!="") {
                insulinComment = record.data.insulin.comment
            }
            if ( record.data.weight.comment!="") {
                weightComment = record.data.weight.comment
            }
        
        resjson = {
            date:date,
            name:name,
            weightComment:weightComment,
            insulinComment:insulinComment,
            exerciseComment:exerciseComment,
            glucoseComment:glucoseComment
        }
        if (
            glucoseComment != null ||
            weightComment != null ||
            insulinComment != null ||
            exerciseComment != null
        ){
           arr.push(resjson)
        }

        
            
    }
    console.log(arr.length)
    arr.reverse();
    // res.send(arr)
    return res.render('inbox.hbs', {
        style: 'inbox.css',
        record: arr
    })
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

const comment = (req, res) => {
    res.render('comment.hbs', {
        style: 'inbox.css',
    })
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
    res.render('register.hbs')
}

const register = async (req, res) => {
    // find if the patient already exists
    if (await Patient.findOne({ username: req.body.username }, {})) {
        return res.render('register.hbs', { registerUsernameExists: true })
    }

    // add new patient
    try {
        const newPatient = new Patient()
        Object.assign(newPatient, req.body)
        await newPatient.save()
    } catch (err) {
        console.log(err);
        return res.render('register.hbs', { registerFailure: true })
    }

    // insert patient into clinician's patientList
    const clinicianId = req.session.passport ? req.session.passport.user : ''
    const clinician = await Clinician.findById(clinicianId)
    clinician.patients.push({ patientId: newPatient._id })
    await clinician.save()

    return res.render('register.hbs', { registerSuccess: true })
}

const renderSupportMSG = async (req, res) => {
    return res.render('message.hbs')
}

const writeSupportMSG = async (req, res) => {
    try {
        const patientId = '628232e50d0230caaa118181'
        const patient = await Patient.findById(patientId)
        patient.supportMSG = req.body.supportMSG;
        await patient.save();
        return res.render('message.hbs', { supportSuccess: true })
    } catch (err) {
        console.log(err);
        return res.render('message.hbs', { supportFailure: true })
    }
}

const renderClinicalNote = async (req, res) => {
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
    renderClinicalNote,
    renderSupportMSG,
    writeSupportMSG,
    doctorhome,
    doctor_login,
    doctor,
    logout,
    comment,
    getAllPatientCommentToday,
    table
}
