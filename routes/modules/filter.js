const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')
const Category = require('../../models/category')
const totalCalculatorUtil = require('../../utils/totalCalculatorUtil')

//get expenses by category
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id
    const categoryId = req.body.filter
    //if filter all expenses, query all results by user
    if(categoryId === 'all') {
      res.redirect('/')
    } else {
      //if filter one category expense, query by category
      const expenses = await Expense.find({ categoryId: categoryId, userId }).lean()
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
      const totalAmount = totalCalculatorUtil(mappedExpenses)
      
      res.render('index', { mappedExpenses, totalAmount, categories, category })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }

})

module.exports = router