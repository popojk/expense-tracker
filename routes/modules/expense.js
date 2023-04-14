const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')
const Category = require('../../models/category')

//get create new expense page
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', {categories})
})

//post request to create new expense
router.post('/new', (req,res) => {
  const {name, date, categoryId, amount} = req.body
  console.log(date)
  return Expense.create({
    name: name,
    date: date,
    amount: amount,
    categoryId
  })
  .then(() => res.redirect('/'))
  .catch(err => console.log(err))
})

module.exports = router