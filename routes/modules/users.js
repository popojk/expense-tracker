const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req,res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) { return next(err) }
    req.flash('success_msg', '你已成功登出')
    res.redirect('/users/login')
  })
})

module.exports = router