// import demo model
const {
    Patient, Clinician
} = require('../models/db.js')
const {
    Record
} = require('../models/db.js')
const utils = require('../utils/utils.js')
const findAll = async (req, res) => {
    result = await Patient.find()
    res.send(result)
}

const findOneById = async (req, res) => {
    result = await Patient.findById(req.params.id)
    res.send(result)
}

const addOne = async (req, res) => {
    console.log('adding patient')
    const newPatient = new Patient()
    Object.assign(newPatient, req.body)
    await newPatient
        .save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const editOne = async (req, res) => {
    console.log('editing patient ' + req.params.id)
    patient = await Patient.findById(req.params.id)
    if (!patient) {
        res.status(404).send('patient not found')
        return
    }
    Object.assign(patient, req.body)
    await patient
        .save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const deleteOne = async (req, res) => {
    result = await Patient.findOne({
        username: req.params.username
    }, {})
    if (!result) {
        res.status(404).send('patient not found')
        return
    }
    console.log('deleting patient ' + req.params.username)
    await Patient.deleteOne({
        username: req.params.username
    }, {})
    result = await Patient.find()
    res.send(result)
}

const getAllPatientRecordToday = async (req, res) => {
    clinician = await Clinician.findById(req.user._id)
    result = clinician.patients

    if (!result) {
        res.status(404).send('patient not found')
        return
    }
    var arr = new Array()
    for (var i = 0; i < result.length; i++) {
        patient = await Patient.findById(result[i].patientId)
        
        patientId = patient._id
        username = patient.username
        realname = patient.name
        
        thresholdExecrise = patient.thresholdExecrise
        thresholdGlucose = patient.thresholdGlucose
        thresholdWeight = patient.thresholdWeight
        thresholdInsulin = patient.thresholdInsulin

        date = utils.getMelbDate()
        const record = await Record.findOne({
            patientId: patient._id,
            recordDate: date,
        })
        var glucoseStatus, weightStatus, insulinStatus, exerciseStatus
        var glucose = null,
            weight = null,
            insulin = null,
            exercise = null
        if (record) {
            if (patient.needGlucose) {
                glucoseStatus = record.data.glucose.status
                glucose = record.data.glucose.data
            } else {
                glucoseStatus = 'NO_NEED'
            }
            if (patient.needExecrise) {
                exerciseStatus = record.data.exercise.status
                exercise = record.data.exercise.data
            } else {
                exerciseStatus = 'NO_NEED'
            }
            if (patient.needInsulin) {
                insulinStatus = record.data.insulin.status
                insulin = record.data.insulin.data
            } else {
                insulinStatus = 'NO_NEED'
            }
            if (patient.needWeight) {
                weightStatus = record.data.weight.status
                weight = record.data.weight.data
            } else {
                weightStatus = 'NO_NEED'
            }
        } else {
            glucoseStatus = patient.needGlucose ? 'UNRECORDED' : 'NO_NEED'
            weightStatus = patient.needWeight ? 'UNRECORDED' : 'NO_NEED'
            insulinStatus = patient.needInsulin ? 'UNRECORDED' : 'NO_NEED'
            exerciseStatus = patient.needExecrise ? 'UNRECORDED' : 'NO_NEED'
        }

        if (
            glucoseStatus == 'RECORDED' &&
            (glucose < thresholdGlucose * 0.9 ||
                glucose > thresholdGlucose * 1.1)
        ) {
            glucoseStatus = 'ALERT'
        }
        if (
            weightStatus == 'RECORDED' &&
            (weight < thresholdWeight * 0.9 || weight > thresholdWeight * 1.1)
        ) {
            weightStatus = 'ALERT'
        }
        if (
            insulinStatus == 'RECORDED' &&
            (insulin < thresholdInsulin * 0.9 ||
                insulin > thresholdInsulin * 1.1)
        ) {
            insulinStatus = 'ALERT'
        }
        if (
            exerciseStatus == 'RECORDED' &&
            (exercise < thresholdExecrise * 0.9 ||
                exercise > thresholdExecrise * 1.1)
        ) {
            exerciseStatus = 'ALERT'
        }
        resjson = {
            _id: patientId,
            username: username,
            name: realname,
            glucoseStatus: glucoseStatus,
            glucose: glucose,
            weightStatus: weightStatus,
            weight: weight,
            insulinStatus: insulinStatus,
            insulin: insulin,
            exerciseStatus: exerciseStatus,
            exercise: exercise,
        }
        if (
            glucoseStatus == 'ALERT' ||
            weightStatus == 'ALERT' ||
            insulinStatus == 'ALERT' ||
            exerciseStatus == 'ALERT'
        ) {
            arr.unshift(resjson)
        } else {
            arr.push(resjson)
        }
    }
    
    // res.send(arr)
    return res.render('dashboard', {
        patient: arr
    })
}

const getEngagement = async (req, res) => {
    result = await Patient.find()
    if (!result) {
        res.status(404).send([])
        return
    }
    const today = new Date(utils.getMelbDate())
    var arr = new Array()
    for (var i = 0; i < result.length; i++) {
        var create = new Date(result[i].create_date)
        var time_diff = today - create
        var day = Math.floor(time_diff / 86400000) + 1
        count = 0
        for (var j = 0; j < result[i].records.length; j++) {
            if (result[i].records[j].isEngaged) {
                count += 1
            }
        }
        update_time = null
        if(result[i].records.length>0){
            update_time = utils.formatDate(result[i].records[0].recordDate)+"T"+result[i].records[0].updateTime 
        }
        arr.push({
            "username": result[i].username,
            "_id": result[i]._id,
            "rate": count / day,
            "update_time" : update_time
        })


    }
    arr.sort((a, b) => {
        if(a.rate == b.rate){
            a_time = new Date(a.update_time)
            b_time = new Date(b.update_time)
            return b_time-a_time
        }
        return b.rate - a.rate})

    //console.log(arr)
    res.send(arr)
}


// exports an object, which contains a function named getAllDemoData
module.exports = {
    findAll,
    findOneById,
    addOne,
    editOne,
    deleteOne,
    getAllPatientRecordToday,
    getEngagement,
}