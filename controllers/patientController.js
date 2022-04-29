// import demo model
const { Patient } = require('../models/db.js')
const { Record } = require('../models/db.js')
const findAll = async (req, res) => {
    result = await Patient.find()
    res.send(result)
}

const findOneById = async (req, res) => {
    result = await Patient.findOne({ username: req.params.username }, {})
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
    console.log('editing patient ' + req.params.username)
    patient = await Patient.findOne({ username: req.params.username }, {})
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
    result = await Patient.findOne({ username: req.params.username }, {})
    if (!result) {
        res.status(404).send('patient not found')
        return
    }
    console.log('deleting patient ' + req.params.username)
    await Patient.deleteOne({ username: req.params.username }, {})
    result = await Patient.find()
    res.send(result)
}

const getAllPatientRecordToday = async (req, res) => {
    result = await Patient.find()
    if (!result) {
        res.status(404).send('patient not found')
        return
    }
    var arr = new Array()
    for (var i = 0; i < result.length; i++) {
        username = result[i].username
        realname = result[i].name
        thresholdExecrise = result[i].thresholdExecrise
        thresholdGlucose = result[i].thresholdGlucose
        thresholdWeight = result[i].thresholdWeight
        thresholdInsulin = result[i].thresholdInsulin

        date = Date.now()
        date = formatDate(date)
        today = new Date(date)
        tmr = new Date(today)
        tmr.setDate(today.getDate() + 1)
        const record = await Record.findOne({
            patientId: result[i]._id,
            recordDate: { $gte: today, $lt: tmr },
        })
        var glucoseStatus, weightStatus, insulinStatus, exerciseStatus
        var glucose =null, weight=null, insulin=null, exercise=null
        if (record) {
            if(result[i].needGlucose){
                glucoseStatus = record.data.glucose.status
                glucose = record.data.glucose.data
            }else{
                glucoseStatus = 'NO_NEED'
            }
            if(result[i].needExecrise){
                exerciseStatus = record.data.exercise.status
                exercise = record.data.exercise.data
            }else{
                exerciseStatus = 'NO_NEED'
            }
            if(result[i].needInsulin){
                insulinStatus = record.data.insulin.status
                insulin = record.data.insulin.data
            }else{
                insulinStatus = 'NO_NEED'
            }
            if(result[i].needWeight){
                weightStatus = record.data.weight.status
                weight = record.data.weight.data
            }else{
                weightStatus = 'NO_NEED'
            }
            // weightStatus = record.data.weight.status
            // weight = record.data.weight.data

            // insulinStatus = record.data.insulin.status
            // insulin = record.data.insulin.data

            // exerciseStatus = record.data.exercise.status
            // exercise = record.data.exercise.data
        } else {
            glucoseStatus = result[i].needGlucose ? 'UNRECORDED' : 'NO_NEED'
            weightStatus = result[i].needWeight ? 'UNRECORDED' : 'NO_NEED'
            insulinStatus = result[i].needInsulin ? 'UNRECORDED' : 'NO_NEED'
            exerciseStatus = result[i].needExecrise ? 'UNRECORDED' : 'NO_NEED'
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
    res.send(arr)
    // return res.render('dashboard', { patient: arr })
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

// exports an object, which contains a function named getAllDemoData
module.exports = {
    findAll,
    findOneById,
    addOne,
    editOne,
    deleteOne,
    getAllPatientRecordToday,
}
