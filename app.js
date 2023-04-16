const express = require('express')
const routes = require('./routes')
const app = express()
const exphbs = require('express-handlebars')
//載入method-override
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const router = require('./routes')
const flash = require('connect-flash')

//request body parser
app.use(express.urlencoded({ extended: true }))
//定義要使用的樣版引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//只要連線有被執行就好不需要回傳值，所以不用設定變數
require('./config/mongoose')

//告訴express要使用的view engine 是 handlebar
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  //res.locals.isAuthenticated = req.isAuthenticated()
  //res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(methodOverride('_method'))
app.use(routes)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://locallhost:${process.env.PORT}`)
})