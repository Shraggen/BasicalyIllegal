const db = require('../models/db')
const bcrypt = require('bcryptjs')
module.exports = (req, res, next) => {
    let authHeader = req.get("authorization")
    if(authHeader) {
        auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        let username = auth[0]
        let password = auth[1]
        db.User.findOne({username: username}).then(user => {
            let hash = bcrypt.hashSync(password, user.salt)
            if(hash == user.password) {
                req.session.id = user.id
                return next()
            }
            res.sendStatus(401)
        })
    } else {
        if(req.session.id)
            return next()
        res.sendStatus(401)
    }
}