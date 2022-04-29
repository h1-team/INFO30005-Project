function getTime() {
    var date = new Date()
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

async function init() {
    //axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
    axios.defaults.baseURL = "http://localhost:3000/api";
    const res = await axios({
        url: '/record/getOneRecord',
        data: {
            patientId: '62694cb55403b01e62571abd',
            recordDate: getTime(),
        },
        method: 'POST',
    })
    if (res.status == 200) {
        const { data } = res.data
        glucose.value = data.glucose.data
        glucoseComment.value = data.glucose.comment

        weight.value = data.weight.data
        weightComment.value = data.weight.comment

        insulin.value = data.insulin.data
        insulinComment.value = data.insulin.comment

        exercise.value = data.exercise.data
        exerciseComment.value = data.exercise.comment
    }
}
//initialise the latest data
init()
//when clink submit, the event function will work
insertForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const data = {
        patientId: '62694cb55403b01e62571abd',
        recordDate: getTime(),
        data: {
            glucose: {
                data: glucose.value,
                comment: glucoseComment.value,
            },
            weight: {
                data: weight.value,
                comment: weightComment.value,
            },
            insulin: {
                data: insulin.value,
                comment: insulinComment.value,
            },
            exercise: {
                data: exercise.value,
                comment: exerciseComment.value,
            },
        },
    }
    //axios.defaults.baseURL = 'https://bad-designers.herokuapp.com/api'
    axios.defaults.baseURL = "http://localhost:3000/api";
    const res = await axios({
        url: '/record/updateData',
        data,
        method: 'POST',
    }).catch(function (error) {
        alert('invalid input')
    })
    alert('update success!')
})
