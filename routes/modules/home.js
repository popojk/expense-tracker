const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')
const totalCalculatorUtil = require('../../utils/totalCalculatorUtil')

// get all expenses and show in home page
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const expenses = await Expense.find({ userId }).lean()
    const categories = await Category.find().lean()
    // to map categoryUrl into expense records
    const mappedExpenses = await Promise.all(expenses.map(async (expense) => {
      const categoryId = expense.categoryId
      const category = await Category.findOne({ _id: categoryId }).lean()
      return {
        ...expense,
        date: expense.date.toLocaleDateString(),
        imageUrl: category.imageUrl
      }
    }))
    // calculate total amount
    const totalAmount = totalCalculatorUtil(mappedExpenses)

    res.render('index', { mappedExpenses, totalAmount, categories })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
