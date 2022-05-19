const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const utils = require('../utils/utils.js')
const { Timestamp } = require('mongodb')

const STATUS = ['RECORDED', 'UNRECORDED', 'NO_NEED']
const recordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    recordDate: { type: Date, required: true },
    updateTime: { type: String, required: false },
    isEngaged: { type: Boolean, default: false },
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
    familyName: { type: String, default: '' },
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '', unique: true },
    textBio: { type: String, default: '' },
    yob: { type: Number, min: 1900, max: 2022 },
    role: { type: String, default: 'patient' },
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
    supportMSG: { type: String, default: '' },
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
    role: { type: String, default: 'clinician' },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    create_date: { type: Date, default: utils.getMelbDate() },
    patients: [],
})

const SALT_FACTOR_C = 11

clinicianSchema.pre('save', function save(next) {
    const user = this
    // Go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next()
    }
    // Automatically generate salt, and calculate hash
    bcrypt.hash(user.password, SALT_FACTOR_C, (err, hash) => {
        if (err) {
            return next(err)
        }
        // Replace password with hash
        user.password = hash
        next()
    })
})

clinicianSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const clinicianNoteSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },

    clinician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinician",
        required: true,
    },
    
    message: { type: String, default: '' },
    create_date: { type: String, default: utils.getMelbDate() },
})

const Record = mongoose.model('record', recordSchema)
const Patient = mongoose.model('patient', patientSchema)
const Clinician = mongoose.model('clinician', clinicianSchema)
const clinicianNote = mongoose.model('clinicianNote', clinicianNoteSchema)

module.exports = { Patient, Record, Clinician, clinicianNote }
