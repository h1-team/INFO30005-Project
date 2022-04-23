// import demo model 
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
      res.send("error happens when render record data");
    }
  };

const updateRecord = async (req, res) => {
    try {
      id = req.body.patientId
      date = req.body.recordDate
      const patient = await Patient.findById(id)
      if(!patient){
        throw new Error("no such patient")
      }
      const record = await Record.findOne({patientId: id,recordDate:date})
      if(record){
        // update data
        console.log("updating record\n")
        Object.assign(record,req.body)
        changeStatus(patient.needExecrise,newRecord.data.exercise)
        changeStatus(patient.needGlucose,newRecord.data.glucose)
        changeStatus(patient.needWeight,newRecord.data.weight)
        changeStatus(patient.needInsulin,newRecord.data.insulin)
        await record.save()
        .then((result) => res.send(result))
        .catch((err) => res.status(404).send(err))
      }else{
        //create new record
        newRecord = new Record()
        Object.assign(newRecord,req.body)
        changeStatus(patient.needExecrise,newRecord.data.exercise)
        changeStatus(patient.needGlucose,newRecord.data.glucose)
        changeStatus(patient.needWeight,newRecord.data.weight)
        changeStatus(patient.needInsulin,newRecord.data.insulin)
        await newRecord.save()
        .then((result) => res.send(result))
        .catch((err) => res.status(404).send(err))
        console.log("new record\n",newRecord)
      }
    } catch (err) {
      res.status(404).send(err.toString())
    }
  }

const findAll =  async (req, res) => {
    result = await Record.find()
    res.send(result)
}

function changeStatus(isNeed,record){
  if(!isNeed){
    record.status = "NO_NEED"
  }else if(record.data == null){
    record.status = "UNRECORDED"
  }else{
    record.status = "RECORDED"
  }

}


// exports an object, which contains a function named getAllDemoData 
module.exports = { 
    renderRecordData,
    updateRecord,
    findAll,
} 