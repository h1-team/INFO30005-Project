const axios = require('axios').default
const { Clinician } = require('../models/db.js')
const { Patient } = require('../models/db.js')
const { Record } = require('../models/db.js')
const { clinicianNote } = require('../models/db.js')
// axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
axios.defaults.baseURL = 'http://localhost:3000/api'
const utils = require('../utils/utils.js')

const doctorhome = (req, res) => {
    res.render('home.hbs', {
        style: 'doctor.css',
    })
}

const doctor_login = (req, res) => {
    res.render('doc_login.hbs', {
        style: 'login.css',
        flash: req.flash('error'),
    })
}

const doctor = (req, res) => {
    // console.log(req)
    res.render('doctor.hbs', {
        name: req.user.username,
        style: 'doctor_home.css',
    })
}

const findAll = async (req, res) => {
    result = await Clinician.find()
    res.send(result)
}

const getAllPatientCommentToday = async (req, res) => {
    clinician = await Clinician.findById(req.user._id)
    //console.log(clinician)
    result = clinician.patients

    if (!result) {
        res.status(404).send('patient not found')
        return
    }
    var arr = new Array()
    //console.log(result.length)
    for (var i = 0; i < result.length; i++) {  
        const patient =  await Patient.findOne({_id: result[i].patientId}).lean()
        const record = await Record.find({
            patientId: patient._id
        }).lean()
        var name=patient.name
        if(!name){
            continue;
        }
        var comments=new Array()
        for(var j=0;j<record.length;j++){
            var d = record[j].recordDate
            var date = d.getUTCDate();
            var y = d.getFullYear();
            var m = d.getMonth();
            var monthArr = ["Jan.", "Feb.","Mar.", "Apr.", "May", "Jun.", "Jul.","Aug.", "Sep.", "Oct.", "Nov.","Dec."];
            m = monthArr[m];
            tableDate = m + "/" + date + "/" + y
            record.recordDate = tableDate
            //console.log(record[j].data)
            var glucoseComment=record[j].data.glucose.comment
                weightComment= record[j].data.exercise.comment, 
                insulinComment= record[j].data.insulin.comment, 
                exerciseComment= record[j].data.exercise.comment
            var comment = {
                date:tableDate,
                weightComment:weightComment,
                insulinComment:insulinComment,
                exerciseComment:exerciseComment,
                glucoseComment:glucoseComment
            }
            if (
                glucoseComment != "" ||
                weightComment != "" ||
                insulinComment != "" ||
                exerciseComment != ""
            ){
               comments.push(comment)
            }

        }     
        comments.reverse();
        if(comments.length==0){
            continue;
        }

        resjson = {
            date:comments[0].date,
            name:name,
            _id:patient._id,
            comments:comments,
            weightComment:comments[0].weightComment,
            insulinComment:comments[0].insulinComment,
            exerciseComment:comments[0].exerciseComment,
            glucoseComment:comments[0].glucoseComment
        }
        if (
            glucoseComment != null ||
            weightComment != null ||
            insulinComment != null ||
            exerciseComment != null
        )
        if(resjson.comments.length!=0){
           arr.push(resjson) 
        }        
    }
    arr.reverse();
    //console.log(arr)
    // res.send(arr)
    return res.render('inbox.hbs', {
        style: 'inbox.css',
        title:"inbox",
        record:arr
    })
}
const findOneById = async (req, res) => {
    result = await Clinician.findOne({ _id: req.params._id }, {})
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
    const newPatient = new Patient()
    try {
        Object.assign(newPatient, req.body)
        await newPatient.save()
    } catch (err) {
        console.log(err)
        res.send(err)
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
    try {
        const patient = await Patient.findOne({_id: req.params._id}).lean()
        res.render('message.hbs', {patient: patient})
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

const writeSupportMSG = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params._id);
        patient.supportMSG = req.body.supportMSG
        await patient.save()
        return res.render('message.hbs', { supportSuccess: true })
    } catch (err) {
        console.log(err)
        res.send(err)
        return res.render('message.hbs', { supportFailure: true })
    }
}

const renderOnePatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({_id: req.params._id}).lean()
        res.render('profile.hbs', {patient: patient})
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

const renderNewNote = async (req, res) => {
    try {
        const date = utils.getMelbDate()
        const patient = await Patient.findOne({_id: req.params._id}).lean()
        res.render('new_note.hbs', {patient: patient, date: date},)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

const addNewNote = async (req, res) => {
    try {
        const date = utils.getMelbDate()
        const patient_id = req.params._id
        const clinician_id = req.session.passport ? req.session.passport.user : ''
        const newNote = new clinicianNote({
            patient: patient_id,
            clinician: clinician_id,
            message: req.body.message,
        })

        await newNote.save()
        return res.render('new_note.hbs', { success: true, date: date })
    } catch (err) {
        const date = utils.getMelbDate()
        console.log(err)
        return res.render('new_note.hbs', { failure: true, date: date })
    }
}

const clinicalNote = async (req, res) => {
    const patient_id = req.params._id
    const clinician_id = req.session.passport ? req.session.passport.user : ''
    const patient = await Patient.findById(patient_id).lean()
    const notes = await clinicianNote.find({
        patient: patient_id,
        clinician: clinician_id,
    }).lean()

    if (!result) {
        return res.render('clinical_note.hbs', {note: notes, patient: patient})
    }

    return res.render('clinical_note.hbs', {note: notes, patient: patient})
}

const logout = (req, res) => {
    req.logout()
    res.redirect("/doctor")
}

const table = async(req, res) => {
        try{
            console.log(req)
            const table = await Record.find({patientId: req.params._id}).lean()
            const patient =  await Patient.findOne({_id: req.params._id}).lean()
            console.log(table)
            console.log(patient)     
            for (var record of table) {
    
                // date formatting
                var d = record.recordDate
                var date = d.getUTCDate();
                var y = d.getFullYear();
                var m = d.getMonth();
                var monthArr = ["Jan.", "Feb.","Mar.", "Apr.", "May", "Jun.", "Jul.","Aug.", "Sep.", "Oct.", "Nov.","Dec."];
                m = monthArr[m];
                tableDate = m + "/" + date + "/" + y
                //console.log(tableDate);
                record.recordDate = tableDate
    
    
                // indentify alert data
                var glucose = record.data.glucose.data
                var glucoseStatus = record.data.glucose.status
                var thresholdGlucose = patient.thresholdGlucose
    
                if (glucoseStatus == 'RECORDED' &&
                    (glucose < thresholdGlucose * 0.9 ||
                        glucose > thresholdGlucose * 1.1)
                ) {
                    record.data.glucose.status = 'ALERT'
                }
    
                var weight = record.data.weight.data
                var weightStatus = record.data.weight.status
                var thresholdWeight = patient.thresholdWeight
    
                if (weightStatus == 'RECORDED' &&
                    (weight < thresholdWeight * 0.9 || weight > thresholdWeight * 1.1)
                ) {
                    record.data.weight.status = 'ALERT'
                }
    
                var insulin = record.data.insulin.data
                var insulinStatus = record.data.insulin.status
                var thresholdInsulin = patient.thresholdInsulin
    
                if (insulinStatus == 'RECORDED' &&
                    (insulin < thresholdInsulin * 0.9 ||
                        insulin > thresholdInsulin * 1.1)
                ) {
                    record.data.insulin.status = 'ALERT'
                }
    
                var exercise = record.data.exercise.data
                var exerciseStatus = record.data.exercise.status
                var thresholdExecrise = patient.thresholdExecrise
    
                if (exerciseStatus == 'RECORDED' &&
                    (exercise < thresholdExecrise * 0.9 ||
                        exercise > thresholdExecrise * 1.1)
                ) {
                    record.data.exercise.status = 'ALERT'
                }
    
            }
            res.render('check_pat_data.hbs', {
                style: 'table_doctor.css',
                title: "Viewing data",
                record: table.reverse(),
                name: patient.username,
                patient: patient,
                id:patient._id
            })
        }catch(err){
            console.log(err)
            //res.redirect('/login')
        }
}

const manage_patient = async (req, res) => {
    try {
        const userID = req.params._id
        const patient_user = await Patient.findById(req.params._id)

        const username = patient_user.username
        // send request
        const patient = await axios({
            url: `/patient/findone/${userID}`,
            methods: "get",
        })
        // console.log(req.user);
        // console.log(req.user);
        res.render('manage_patient.hbs', {
            isChecked: {
                needExecrise: patient.data.needExecrise ? 'checked' : '',
                needGlucose: patient.data.needGlucose ? 'checked' : '',
                needWeight: patient.data.needWeight ? 'checked' : '',
                needInsulin: patient.data.needInsulin ? 'checked' : '',
            },
            vals: {
                thresholdExecrise: patient.data.thresholdExecrise,
                thresholdGlucose: patient.data.thresholdGlucose,
                thresholdWeight: patient.data.thresholdWeight,
                thresholdInsulin: patient.data.thresholdInsulin,
            },
            name: username,
            patientId: patient.data._id,
        })
    } catch (err) {
        console.log(err);
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
    renderNewNote,
    addNewNote,
    clinicalNote,
    renderSupportMSG,
    writeSupportMSG,
    renderOnePatientProfile,
    doctorhome,
    doctor_login,
    doctor,
    logout,
    getAllPatientCommentToday,
    table,
    manage_patient,
}
