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

const recordSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true},
    recordDate: {type: String, required: true},
    data: {
      bgl: {
        status: {type: String, enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
        data: {type:Number, min:0},
        comment: { type: String, default: "" }
        
      }, 
      weight: {
        status: {type: String, enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
        data: {type:Number, min:0},
        comment: { type: String, default: "" }
      }, 
      doit: {
        status: {type: String, enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
        data: {type:Number, min:0},
        comment: { type: String, default: "" }
      }, 
      exercise: {
        status: {type: String, enum: ["recorded", "unrecorded", "no need"], default: "unrecorded"},
        data: {type:Number, min:0},
        comment: { type: String, default: "" }
      },
    }
  });

const patientSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    photo: { type: String, default: "" },
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    dob: Date,
    phone: { type: String, default: "" },
    password: { type: String, required:true,min:8},
    isExecrise: { type: Boolean, default: false },
    isGlucose: { type: Boolean, default: false },
    isWeight: { type: Boolean, default: false },
    isInsulin: { type: Boolean, default: false },
    records: [recordSchema]
})


const testSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    age: { type: Number, default: 0 },
    isMale:{ type: Boolean, default: true }
})
const Test = mongoose.model('test',testSchema)


const Record = mongoose.model('record',recordSchema)
const Patient = mongoose.model('patient',patientSchema)

module.exports = {Patient,
  Record,
Test}
