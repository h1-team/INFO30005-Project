// import demo model 
const { param } = require('express/lib/request');
const {Patient} = require('../models/db.js')
const {Record} = require('../models/db.js')

function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [year, month, day].join("-");
}

async function initPatient() {
    try {
        const result = await Patient.find();
        if (result.length == 0) {
            const newPatient = new Patient({
            username:"Pat",
            photo:  "",
            name: "pig",
            address: "dsdsda",
            phone: 21312,
            password: "12345678",
            // isExercise: true,
            // isGlucose: true,
            // isWeightd: true,
            // isInsulin: true,
            exercise_records: [],
            weight_records: [],
            glucose_records: [],
            insulin_records: []
        });

            const patient = await newPatient.save();
            return patient.id;
        } else {
            const patient = await Patient.findOne({ username: "Pat" });
            return patient.id;
        }
    } catch (err) {
      console.log("Fail to initialize patient: ", err);
    }
}
  
  async function initRecord(patientId) {
    try {
      const result = await Record.findOne({
        patientId: patientId,
        recordDate: formatDate(new Date()),
      });
      if (!result) {
        const newRecord = new Record({
          patientId: patientId,
          recordDate: formatDate(new Date()),
        });
  
        const record = await newRecord.save();
        return record.id;
      } else {
        return result.id;
      }
    } catch (err) {
      console.log("Fail to initialize record: ", err);
    }
}

const renderRecordData = async (req, res) => {
    try {
      const patientId = await initPatient();
      const recordId = await initRecord(patientId);
      // const patient = await Patient.findOne({ _id: patientId }).lean();
      const record = await Record.findOne({ _id: recordId })
        .populate({
          path: "patientId",
          options: { lean: true },
        })
        .lean();
      console.log(record);
  
      // console.log("-- record info when display -- ", record);
      res.render("recordData.hbs", { record: record });
    } catch (err) {
      res.status(400);
      res.send("fail to render record data");
    }
  };

const updateRecord = async (req, res) => {
    console.log("updating record");
    try {
      //find the record of the that date,if exist  update,if not create a new record
      id = req.body.patientId
      date = req.body.recordDate
      const patient = await Patient.findOne({patientId: id});
      const record = await Record.findOne({patientId: id,recordDate:date});
      if(record){
        // update data
        Object.assign(patient,req.body)
        await patient.save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
      }else{
        
        console.log("create a new record",record)
        newrecord = new Record({
          patientId :req.body.patientId,
          date :req.body.patientId
        })
        //console.log("no record",record)
      }
      // const patientId = await initPatient();
      // const recordId = await initRecord(patientId);
      // const record = await Record.findOne({_id: recordId});
      // const data = record.data[req.body.key]
      // data.value = req.body.value
      // data.comment = req.body.comment
      // data.status = "recorded"

    // record.save()
      //console.log(record);
      //res.redirect("/api/record");
      res.send("dsds");

    } catch (err) {
      console.log("error happens in update record: ", err);
    }
  };

const findAll =  async (req, res) => {
    result = await Record.find()
    res.send(result)
}

// exports an object, which contains a function named getAllDemoData 
module.exports = { 
    renderRecordData,
    updateRecord,
    findAll,
} 