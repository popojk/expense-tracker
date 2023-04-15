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
  return Expense.create({
    name: name,
    date: date,
    amount: amount,
    categoryId
  })
  .then(() => res.redirect('/'))
  .catch(err => console.log(err))
})

//get edit page
router.get('/:id/edit', async (req, res) => {
  try{
  const categories = await Category.find().lean()
  const _id = req.params.id
  const expense = await Expense.findOne({_id}).lean()
  const category = await Category.findOne({ _id: expense.categoryId }).lean()
  expense.categoryName = category.name
  expense.date = expense.date.toISOString().slice(0, 10)
  res.render('edit', { expense, categories })
  } catch(err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//sent put request to update expense
router.put('/:id', (req,res) => {
  try{
    const { name, date, categoryId, amount } = req.body
    const _id = req.params.id
    return Expense.findOneAndUpdate(
      { _id }
      ,{
      name: name,
      date: date,
      amount: amount,
      categoryId
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  } catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//set delete request to delete expense
router.delete('/:id', (req, res) => {
  try{
    const _id = req.params.id
    return Expense.findOneAndDelete({ _id })
                  .then(()=> res.redirect('/'))
  } catch(err){
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router