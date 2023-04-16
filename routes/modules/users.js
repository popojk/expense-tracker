const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

//get login page
router.get('/login', (req,res) => {
  res.render('login')
})

//login function
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

//logout function
router.get('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) { return next(err) }
    req.flash('success_msg', '你已成功登出')
    res.redirect('/users/login')
  })
})

//get register page
router.get('/register', (req, res) => {
  res.render('register')
})

//register function
router.post('/register', (req, res) => {
  //get form data
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必須' })
  }

  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }

  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  //check if user already registered
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: '這個Email已經註冊過' })
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      //if user not yet registered, write into the db
      return bcrypt
        .genSalt(10)// 產生「鹽」，並設定複雜度係數為 10
        .then(salt => bcrypt.hash(password, salt))// 為使用者密碼「加鹽」，產生雜湊值
        .then(hash =>
          User.create({
            name,
            email,
            password: hash// 用雜湊值取代原本的使用者密碼
          }))
        .then(user => {
          //auto login after registered
          req.login(user, function (err) {
            if (err) { return next(err) }
            return res.redirect('/')
          })
        })
        .catch(err => console.log(err))
    }
  })
    .catch(err => console.log(err))
})

module.exports = router