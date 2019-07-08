const router = require('express').Router()
const bcrypt = require('bcryptjs')
const db = require('../db')

router.post('/login', bodyCheck, (req, res) => {
    const {username, password} = req.body
    db.User.findOne({username: username})
    .then(user => {
        const hash = bcrypt.hashSync(password, user.salt)
        if(hash === user.password) {
            req.session.id = user.id
            res.sendStatus(200)
        } else {
            res.sendStatus(401)
        }
    }).catch(err => {
        res.status(404).send("User not found")
    })
})

router.post('/register', bodyCheck, checkDuplicate, (req, res) => {
    const {username, password} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    var user = new db.User({
        username: username,
        password: password,
        salt: salt
    })
    user.save().then(doc => {
        req.session.id = doc.id
        res.sendStatus(200)
    }).catch(err => {
        res.status(500).send(err)
    })
})

router.get('/logout', (req, res) => {
    req.session = null
    res.sendStatus(200)
})

router.get('/checkLogin', (req, res) => {
    if(req.session.id) {
        return res.sendStatus(200)
    }
    res.sendStatus(401)
})

function bodyCheck(req, res, next) {
    const {username, password} = req.body
    if(username || password)
        return next()
    res.sendStatus(400)
}

function checkDuplicate(req, res, next) {
    db.User.findOne({username: req.body.username})
    .then(user => {
        if(user) {
            res.status(400).send("Duplicate")
        } else {
            next()
        }
    })
    .catch(err => {
        res.status(500).send(err)
    })
}

module.exports = router