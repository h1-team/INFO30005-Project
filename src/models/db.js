const { MongoServerClosedError } = require('mongodb')
const mongoose = require('mongoose')
// let conntectionURL = 'mongodb://localhost:27017/bad_designer'
let conntectionURL = 'mongodb+srv://yuanbo:xuyuanbo28@bad-designer.5vta5.mongodb.net/test'
mongoose.connect(conntectionURL)
const db = mongoose.connection


db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('conntected to Mongo')
})

const exerciseSchema = new mongoose.Schema({
    pattientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    comment: String,
    when: { type: Date, default: Date.now }
})

const weightSchema = new mongoose.Schema({
    pattientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    comment: String,
    when: { type: Date, default: Date.now }
})
const glucoseSchema = new mongoose.Schema({
    pattientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    comment: String,
    when: { type: Date, default: Date.now }
})
const insulinSchema = new mongoose.Schema({
    pattientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    comment: String,
    when: { type: Date, default: Date.now }
})

const patientSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    photo: String,
    name: String,
    address: String,
    dob: Date,
    phone: Number,
    password: String,
    isExecrise: { type: Boolean, default: false },
    isGlucose: { type: Boolean, default: false },
    isWeight: { type: Boolean, default: false },
    isInsulin: { type: Boolean, default: false },
    execrise_records: [exerciseSchema],
    weight_records: [weightSchema],
    glucose_records: [glucoseSchema],
    insulin_records: [insulinSchema]
})


const testSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    age: { type: Number, default: 0 },
    isMale:{ type: Boolean, default: true }
})
const Test = mongoose.model('test',testSchema)



const Patient = mongoose.model('patient',patientSchema)
const Exercise = mongoose.model('exercise',exerciseSchema)
const Insulin = mongoose.model('insulin',insulinSchema)
const Glucose = mongoose.model('glucose',glucoseSchema)
const Weight = mongoose.model('weight',weightSchema)

module.exports = {Patient,Exercise,Insulin,Glucose,Weight,Test}
