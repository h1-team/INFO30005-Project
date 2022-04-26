const mongoose = require('mongoose')

// const { MongoServerClosedError } = require('mongodb')
// const mongoose = require('mongoose')
// // let conntectionURL = 'mongodb://localhost:27017/bad_designer'
// let conntectionURL =
//     'mongodb+srv://yuanbo:xuyuanbo28@bad-designer.5vta5.mongodb.net/test'
// mongoose.connect(conntectionURL)
// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', () => {
//     console.log('conntected to Mongo')
// })

const STATUS = ['RECORDED', 'UNRECORDED', 'NO_NEED']
const recordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    recordDate: { type: Date, required: true },
    data: {
        glucose: {
            status: { type: String, enum: STATUS, default: 'UNRECORDED' },
            data: { type: Number, min: 0 },
            comment: { type: String, default: '' },
        },
        weight: {
            status: { type: String, enum: STATUS, default: 'UNRECORDED' },
            data: { type: Number, min: 0 },
            comment: { type: String, default: '' },
        },
        insulin: {
            status: { type: String, enum: STATUS, default: 'UNRECORDED' },
            data: { type: Number, min: 0 },
            comment: { type: String, default: '' },
        },
        exercise: {
            status: { type: String, enum: STATUS, default: 'UNRECORDED' },
            data: { type: Number, min: 0 },
            comment: { type: String, default: '' },
        },
    },
})

const patientSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    photo: { type: String, default: '' },
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    dob: Date,
    phone: { type: String, default: '' },
    password: { type: String, required: true, min: 8 },
    needExecrise: { type: Boolean, default: true },
    needGlucose: { type: Boolean, default: true },
    needWeight: { type: Boolean, default: true },
    needInsulin: { type: Boolean, default: true },
    thresholdExecrise: { type: Number, default: 2000 ,min:0},
    thresholdGlucose: { type: Number, default: 10 ,min:0},
    thresholdWeight: { type: Number, default: 60 ,min:0},
    thresholdInsulin: { type: Number, default: 2 ,min:0},
    records: [recordSchema],
})

const testSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    age: { type: Number, default: 0 },
    isMale: { type: Boolean, default: true },
})
const Test = mongoose.model('test', testSchema)

const Record = mongoose.model('record', recordSchema)
const Patient = mongoose.model('patient', patientSchema)

module.exports = { Patient, Record }
