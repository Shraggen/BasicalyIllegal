const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const morgan = require('morgan')
const config = require('./config/config')
const userApi = require('./api/user')

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    name: config.cookieSession.name,
    maxAge: config.cookieSession.maxAge,
    keys: config.cookieSession.keys
}))
app.use(morgan('dev'))

//API
app.use('/api/user', userApi)

//Database
mongoose.connect(config.db.connectionString, {useNewUrlParser: true}).then(() => {
    console.log('Connected to Database')
})

//Redirections
app.use(express.static('public'))
app.use('/scripts', express.static(`${__dirname}/node_modules/`))
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`))

//Server
app.listen(port, () => {
    console.log(`Running on port: ${port}`)
})