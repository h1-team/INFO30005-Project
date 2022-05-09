const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const utils = require('../utils/utils.js')

const STATUS = ['RECORDED', 'UNRECORDED', 'NO_NEED']
const recordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    recordDate: { type: Date, required: true },
    isDone: { type: Boolean, default: false },
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
    password: { type: String, required: true },
    needExecrise: { type: Boolean, default: true },
    needGlucose: { type: Boolean, default: true },
    needWeight: { type: Boolean, default: true },
    needInsulin: { type: Boolean, default: true },
    thresholdExecrise: { type: Number, default: 2000, min: 0 },
    thresholdGlucose: { type: Number, default: 10, min: 0 },
    thresholdWeight: { type: Number, default: 60, min: 0 },
    thresholdInsulin: { type: Number, default: 2, min: 0 },
    create_date: { type: Date, default: utils.getMelbDate() },
    records: [recordSchema],
})

patientSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const SALT_FACTOR = 10
patientSchema.pre('save', function save(next) {
    const user = this
    // Go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next()
    }
    // Automatically generate salt, and calculate hash
    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        // Replace password with hash
        user.password = hash
        next()
    })
})

const clinicianSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    photo: { type: String, default: '' },
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    dob: Date,
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    create_date: { type: Date, default: utils.getMelbDate() },
    patients: [],
})

const Record = mongoose.model('record', recordSchema)
const Patient = mongoose.model('patient', patientSchema)
const Clinician = mongoose.model('clinician', clinicianSchema)

module.exports = { Patient, Record, Clinician }
