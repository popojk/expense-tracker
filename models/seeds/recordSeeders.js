const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const User = require('../user')
const Category = require('../category')
const Expense = require('../expense')
const db = require('../../config/mongoose')

db.once('open', async () => {
  //get categories from db
  const categories = await Category.find().lean()
  //map categories data in to name: id data pair
  const categoryIds = {}
  categories.map(category => {
    categoryIds[category.name] = category._id
  })
  //create seed data
  const SEED_USER = {
    name: 'dad',
    email: 'dad@example.com',
    password: '12345678'
  }
  const SEED_EXPENSES = [{
    name: '早餐',
    date: Date.now(),
    amount: 30,
    categoryId: categoryIds['餐飲食品']
  }, {
    name: '交通費',
    date: Date.now(),
    amount: 100,
    categoryId: categoryIds['交通出行']
  }, {
    name: '出遊費用',
    date: Date.now(),
    amount: 2000,
    categoryId: categoryIds['休閒娛樂']
  }, {
    name: '買電腦',
    date: Date.now(),
    amount: 32000,
    categoryId: categoryIds['家居物業']
  }]

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(SEED_USER.password, salt)
  // load user seed into db
  const user = await User.create({
    name: SEED_USER.name,
    email: SEED_USER.email,
    password: hash
  })
  const userId = user._id
  // create promises to load expenses seed into db
  const expensePromises = SEED_EXPENSES.map(async (expense) => {
        await Expense.create({ ...expense, userId })
  })
  const expenses = await Promise.all(expensePromises);
  console.log('user and expenses seeder set done')
  process.exit()
})