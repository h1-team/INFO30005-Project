axios.defaults.baseURL = '/api'

//when clink submit, the event function will work
patientForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const data = {
        needExecrise: needExecrise.checked,
        needGlucose: needGlucose.checked,
        needWeight: needWeight.checked,
        needInsulin: needInsulin.checked,
        thresholdExecrise: +thresholdExecrise.value,
        thresholdGlucose: +thresholdGlucose.value,
        thresholdWeight: +thresholdWeight.value,
        thresholdInsulin: +thresholdInsulin.value,

    }


    const res = await axios({
        url: `/patient/editone/${userName.toLocaleLowerCase()}`,
        data,
        method: 'PUT',
    }).catch(function (error) {
        alert('invalid input')
    })
    const records = {
        patientId,
        recordDate: getMelbDate(),
        glucose: {
            status: needGlucose.checked ? "RECORDED" : "NO_NEED",
        },
        weight: {
            status: needWeight.checked ? "RECORDED" : "NO_NEED",
        },
        insulin: {
            status: needInsulin.checked ? "RECORDED" : "NO_NEED",
        },
        exercise: {
            status: needExecrise.checked ? "RECORDED" : "NO_NEED",
        }
    }
    const res2 = await axios({
        url: '/record/updateData',
        data: records,
        method: 'POST',
    }).catch(function (error) {
        alert('invalid input2')
    })
    // console.log(res2);
    alert('update success!')
})



function getMelbDate() {
    var timezone = 10;
    var offset_GMT = new Date().getTimezoneOffset();
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return year + '-' + month + '-' + day
}