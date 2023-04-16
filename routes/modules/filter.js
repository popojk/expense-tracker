const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')
const Category = require('../../models/category')

//get expenses by category
router.post('/', async (req, res) => {
  try {
    const categoryId = req.body.filter
    //if filter all expenses, query all results by user
    if(categoryId === 'all') {
      res.redirect('/')
    } else {
      //if filter one category expense, query by category
      const expenses = await Expense.find({ categoryId: categoryId }).lean()
      const categories = await Category.find().lean()
      const category = await Category.findOne({ _id: categoryId }).lean()
      const mappedExpenses = await Promise.all(expenses.map(async (expense) => {        
        return {
          ...expense,
          date: expense.date.toLocaleDateString(),
          imageUrl: category.imageUrl,
        }
      }))
      //calculate total amount
      const totalAmount = mappedExpenses.reduce(
        (acc, cur) => acc + cur.amount, 0
      )
      res.render('index', { mappedExpenses, totalAmount, categories, category })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }

})

module.exports = router