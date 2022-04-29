

const welcome =  (req, res) => {
    res.render('welcome.hbs', {
        style: 'welcome.css',
    })
}



const insert  =(req, res) => {
    res.render('insert.hbs', {
        style: 'insert.css',
    })
}

const login = (req, res) => {
    res.render('login.hbs', {
        style: 'login.css',
    })
}


const aboutweb = (req, res) => {
    res.render('aboutweb.hbs', {
        style: 'about.css',
    })
}

const aboutweb2 =  (req, res) => {
    res.render('aboutweb2.hbs', {
        style: 'about.css',
    })
}

const aboutdia =  (req, res) => {
    res.render('aboutdia.hbs', {
        style: 'about.css',
    })
}

const aboutdia2 =  (req, res) => {
    res.render('aboutdia2.hbs', {
        style: 'about.css',
    })
}






module.exports = {
    welcome,
    insert,
    login,
    aboutweb,
    aboutweb2,
    aboutdia,
    aboutdia2,
}
