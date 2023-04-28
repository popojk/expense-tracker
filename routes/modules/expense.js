const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')
const Category = require('../../models/category')

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
    if (name.length > 2) {
      errors.push({ message: '名稱不可輸入超過200字' })
    }
    if (errors.length) {
      const category = await Category.findOne({ _id: categoryId }).lean()
      return res.render('new', {
        errors,
        name,
        date,
        categoryId: category._id,
        categoryName: category.name,
        amount,
        categories
      })
    }

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
    res.render('edit', { expense, categories })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//sent put request to update expense
router.put('/:id', (req, res) => {
  try {
    const userId = req.user._id
    const { name, date, categoryId, amount } = req.body
    const _id = req.params.id
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