axios.defaults.baseURL = '/api'
//Here is the function to post and update the data
//when clink submit, the event function will work
insertForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const data = {
        //patientId: '62779e55ef8bd14bb5143922',
        patientId: userID,
        recordDate: getMelbDate(),
        //updateTime: getMelbDateTime(),
        //recordDate: getMelbDateTime(),
        updateTime : formatTime(),
        
        //recordDate: getTime(),
        data: {
            glucose: {
                data: glucose.value,
                comment: glucoseComment.value.trim(),
            },
            weight: {
                data: weight.value,
                comment: weightComment.value.trim(),
            },
            insulin: {
                data: insulin.value,
                comment: insulinComment.value.trim(),
            },
            exercise: {
                data: exercise.value,
                comment: exerciseComment.value.trim(),
            },
        },
    }
    const res = await axios({
        url: '/record/updateData',
        data,
        method: 'POST',
    }).catch(function (error) {
        alert('invalid input!')
    })
    //refresh the web page
    location.reload()
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
function getMelbDateTime() {
    var timezone = 2
    // var offset_GMT = new Date().getTimezoneOffset()
    var nowDate = new Date().getTime()
    var date = new Date(
        nowDate + timezone * 60 * 60 * 1000
    )
    return date
}

function formatTime(){
    var time = new Date(getMelbDateTime());
    var hour = time.getHours();
    var mins = time.getMinutes();
    var sec = time.getSeconds();
    if(hour >= 0 && hour <= 9){
        hour = "0" + hour;
    }
    if(mins >= 0 && mins <= 9){
        mins = "0" + mins;
    }
    if(sec >= 0 && sec <= 9){
        sec = "0" + sec;
    }
    return [hour,mins,sec].join(':')
}