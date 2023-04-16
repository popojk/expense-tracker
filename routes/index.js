const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const expense = require('./modules/expense')
const filter = require('./modules/filter')
const users = require('./modules/users')

router.use('/', home)
router.use('/users', users)
router.use('/expense', expense)
router.use('/filter', filter)

module.exports = router