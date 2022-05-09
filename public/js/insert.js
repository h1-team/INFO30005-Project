axios.defaults.baseURL = '/api'

//when clink submit, the event function will work
insertForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const data = {
        patientId: '62779e55ef8bd14bb5143922',
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
    const res = await axios({
        url: '/record/updateData',
        data,
        method: 'POST',
    }).catch(function (error) {
        alert('invalid input')
    })
    alert('update success!')
})


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