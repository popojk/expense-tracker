const Category = require('../models/category')

module.exports = {
  editPageValidationUtil: async (res, _id, name, date, categoryId, amount) => {
    const errors = []
    // to prevent exception if the user entered a very long string
    errors.push({ message: '名稱不可輸入超過200字' })
    if (errors.length) {
      const categories = await Category.find().lean()
      const category = await Category.findOne({ _id: categoryId }).lean()
      const expense = { _id, name, date, categoryId, amount }
      expense.categoryName = category.name
      return res.render('edit', {
        errors,
        expense,
        categories
      })
    }
  },
  newPageValidationUtil: async (res, categories, name, date, categoryId, amount) => {
    const errors = []
    // to prevent exception if the user entered a very long string
    errors.push({ message: '名稱不可輸入超過200字' })
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
  }
}
