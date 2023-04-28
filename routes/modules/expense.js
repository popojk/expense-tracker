const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')
const Category = require('../../models/category')

const { editPageValidationUtil, newPageValidationUtil } = require('../../utils/validationUtil')

//get create new expense page
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { categories })
})

//post request to create new expense
router.post('/new', async (req, res) => {
  try {
    const userId = req.user._id
    const { name, date, categoryId, amount } = req.body
    const categories = await Category.find().lean()
    // form validation check
    const errors = []
    //to prevent exception if the user entered a very long string
    if (name.length > 200) {
      return newPageValidationUtil(res, categories, name, date, categoryId, amount)
    }

    //load data to db if validation passed
    return Expense.create({
      name: name,
      date: date,
      amount: amount,
      userId,
      categoryId
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//get edit page
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const categories = await Category.find().lean()
    const _id = req.params.id
    const expense = await Expense.findOne({ _id, userId }).lean()
    const category = await Category.findOne({ _id: expense.categoryId }).lean()
    expense.categoryName = category.name
    expense.date = expense.date.toISOString().slice(0, 10)
    res.render('edit', { 
      expense, categories })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//sent put request to update expense
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const { name, date, categoryId, amount } = req.body
    const _id = req.params.id

    // form validation check
    if(name.length >200 ){
      return editPageValidationUtil(res, _id, name, date, categoryId, amount)
    }
    // if validation check passed, load data to db
    return Expense.findOneAndUpdate(
      { _id }
      , {
        name: name,
        date: date,
        amount: amount,
        userId,
        categoryId
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//set delete request to delete expense
router.delete('/:id', (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    return Expense.findOneAndDelete({ _id, userId })
      .then(() => res.redirect('/'))
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router