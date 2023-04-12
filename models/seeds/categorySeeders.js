const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const db = require('../../config/mongoose')
const CATEGORY_USER = [
  { name: '家居物業', imageUrl: 'https://fontawesome.com/icons/home?style=solid'},
  { name: '交通出行', imageUrl: 'https://fontawesome.com/icons/shuttle-van?style=solid' },
  { name: '休閒娛樂', imageUrl: 'https://fontawesome.com/icons/grin-beam?style=solid' },
  { name: '餐飲食品', imageUrl: 'https://fontawesome.com/icons/utensils?style=solid'},
  { name: '其他', imageUrl: 'https://fontawesome.com/icons/pen?style=solid' }
]

db.once('open', async () => {
  await CATEGORY_USER.forEach((category) => {
    Category.create({name: category.name, imageUrl: category.imageUrl})
  })
  console.log('category seeder set done')
})