const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')
const Category = require('../../models/category')

//get all expenses and show in home page
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().lean()
    //to map categoryUrl into expense records
    const mappedExpenses = await Promise.all(expenses.map(async(expense) => {
      const categoryId = expense.categoryId
      const category = await Category.findOne({ _id: categoryId }).lean()
      return {
        ...expense,
        date: expense.date.toLocaleDateString(),
        imageUrl: category.imageUrl
      }
    }))
    //calculate total amount
    const totalAmount = mappedExpenses.reduce(
      (acc, cur) => acc + cur.amount, 0
    )
    res.render('index', { mappedExpenses, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router