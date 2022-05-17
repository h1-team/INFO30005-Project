function getMelbDate() {
    var timezone = 10
    var offset_GMT = new Date().getTimezoneOffset()
    var nowDate = new Date().getTime()
    var date = new Date(
        nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
    )
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
    var timezone = 10
    // var offset_GMT = new Date().getTimezoneOffset()
    var nowDate = new Date().getTime()
    var date = new Date(
        nowDate + timezone * 60 * 60 * 1000
    )
    return date
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

module.exports = {
    getMelbDate,
    getMelbDateTime,
    formatDate,
}
