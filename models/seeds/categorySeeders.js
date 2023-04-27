const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const db = require('../../config/mongoose')
const CATEGORY_SEED = [
  { name: '家居物業', imageUrl: 'fa-solid fa-house'},
  { name: '交通出行', imageUrl: 'fa-solid fa-van-shuttle' },
  { name: '休閒娛樂', imageUrl: 'fa-solid fa-face-grin-beam' },
  { name: '餐飲食品', imageUrl: 'fa-solid fa-utensils'},
  { name: '其他', imageUrl: 'fa-solid fa-pen' }
]

db.once('open', async () => {
  await Category.create(CATEGORY_SEED)
  console.log('category seeder set done')
  process.exit()
})