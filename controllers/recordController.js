// import demo model
const { Patient } = require('../models/db.js')
const { Record } = require('../models/db.js')

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

const renderRecordData = async (req, res) => {
    try {
        const patientId = await initPatient()
        const recordId = await initRecord(patientId)
        // const patient = await Patient.findOne({ _id: patientId }).lean();
        const record = await Record.findOne({ _id: recordId })
            .populate({
                path: 'patientId',
                options: { lean: true },
            })
            .lean()
        console.log(record)

        // console.log("-- record info when display -- ", record);date
        res.render('recordData.hbs', { record: record })
    } catch (err) {
        res.status(400)
        res.send('error happens when render record data')
    }
}

const updateRecord = async (req, res) => {
    try {
        id = req.body.patientId
        date = req.body.recordDate
        const patient = await Patient.findById(id)
        if (!patient) {
            throw new Error('no such patient')
        }
        date = formatDate(date)
        today = new Date(date)
        tmr = new Date(today)
        tmr.setDate(today.getDate() + 1)
        const record = await Record.findOne({
            patientId: id,
            recordDate: { $gte: today, $lt: tmr },
        })
        if (record) {
            // update data
            console.log('updating record\n')
            Object.assign(record, req.body)
            record.isEngaged = changeStatus(patient.needExecrise, record.data.exercise) |
                            changeStatus(patient.needGlucose, record.data.glucose) |
                            changeStatus(patient.needWeight, record.data.weight) |
                            changeStatus(patient.needInsulin, record.data.insulin)
            patient.records[0] = record
            patient.save()
            await record
                .save()
                .then((result) => res.send(result))
                .catch((err) => res.status(404).send(err))
        } else {
            //create new record
            newRecord = new Record()
            Object.assign(newRecord, req.body)
            newRecord.isEngaged =
                changeStatus(patient.needExecrise, newRecord.data.exercise) |
                changeStatus(patient.needGlucose, newRecord.data.glucose) |
                changeStatus(patient.needWeight, newRecord.data.weight) |
                changeStatus(patient.needInsulin, newRecord.data.insulin)
            patient.records.unshift(newRecord)
            patient.save()
            await newRecord
                .save()
                .then((result) => res.send(result))
                .catch((err) => res.status(404).send(err))
            console.log('new record\n', newRecord)
        }
    } catch (err) {
        res.status(404).send(err.toString())
    }
}

const findAll = async (req, res) => {
    result = await Record.find()
    res.send(result)
}

function changeStatus(isNeed, record) {
    if (!isNeed) {
        record.status = 'NO_NEED'
    } else if (record.data == null) {
        record.status = 'UNRECORDED'
    } else {
        record.status = 'RECORDED'
    }
    return record.status == 'RECORDED'
}

const getRecordStatus = async (req, res) => {
    try {
        id = req.body.patientId
        date = req.body.recordDate
        const patient = await Patient.findById(id)
        if (!patient) {
            throw new Error('no such patient')
        }
        date = formatDate(date)
        today = new Date(date)
        tmr = new Date(today)
        tmr.setDate(today.getDate() + 1)
        result = await Patient.findById(req.body.patientId)
        const record = await Record.findOne({
            patientId: id,
            recordDate: { $gte: today, $lt: tmr },
        })
        var glucose, weight, insulin, exercise
        if (record) {
            glucose = record.data.glucose.status
            weight = record.data.weight.status
            insulin = record.data.insulin.status
            exercise = record.data.exercise.status
        } else {
            glucose = patient.needGlucose ? 'UNRECORDED' : 'NO_NEED'
            weight = patient.needWeight ? 'UNRECORDED' : 'NO_NEED'
            insulin = patient.needInsulin ? 'UNRECORDED' : 'NO_NEED'
            exercise = patient.needExecrise ? 'UNRECORDED' : 'NO_NEED'
        }
        res.send({
            glucose: glucose,
            weight: weight,
            insulin: insulin,
            exercise: exercise,
        })
    } catch (err) {
        res.status(404).send(err)
    }
}

const getOneRecord = async (req, res) => {
    try {
        id = req.body.patientId
        date = req.body.recordDate
        const patient = await Patient.findById(id)
        if (!patient) {
            throw new Error('no such patient')
        }
        date = formatDate(date)
        today = new Date(date)
        tmr = new Date(today)
        tmr.setDate(today.getDate() + 1)
        record = await Record.findOne({
            patientId: id,
            recordDate: { $gte: today, $lt: tmr },
        })
        if (record) {
            res.send(record)
        } else {
            res.send({})
        }
    } catch (err) {
        res.status(404).send(err.toString())
    }
}

// exports an object, which contains a function named getAllDemoData
module.exports = {
    renderRecordData,
    updateRecord,
    findAll,
    getRecordStatus,
    getOneRecord,
}
