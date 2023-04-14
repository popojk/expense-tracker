const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

//get all expenses and show in home page
router.get('/', (req, res) => {
  try {
    Expense.find().lean()
      .then(expenses => {
        //transform date format to YYYY/MM/DD
        return expenses.map((expense) => {
          if (expense) {
            let formattedDate = expense.date.toLocaleDateString()
            expense.date = formattedDate
            return expense
          }
        })
      })
      .then((expenses) => {
        res.render('index', { expenses })
      })
      .catch(err => console.log(err))
  } catch (err) {
    console.log(err)
  }
})

module.exports = router