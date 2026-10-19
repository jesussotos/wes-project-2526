import Products, { Product } from '@/models/Product'
import Orders, { Order } from '@/models/Order'
import Users, { User } from '@/models/User'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

dotenv.config({ path: `.env.local`, override: true })
const MONGODB_URI = process.env.MONGODB_URI

const products: Product[] = [
  {
    name: 'Earthen Bottle',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    description: 'What a bottle!',
  },
  {
    name: 'Nomad Tumbler',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    description: 'Yet another item',
  },
]

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  const opts = {
    bufferCommands: false,
  }
  const conn = await mongoose.connect(MONGODB_URI, opts)

  await conn.connection.db.dropDatabase()

  const insertedProducts = await Products.insertMany(products)


  const user: User = {
    email: 'johndoe@example.com',
    password: await bcrypt.hash('1234', 10),
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  }
  const res = await Users.create(user)
  console.log(JSON.stringify(res, null, 2))

  const userProjection = {
    name: true,
    surname: true,
  }
  const productProjection = {
    name: true,
    price: true,
  }
  const retrievedUser = await Users.findOne(
    { email: 'johndoe@example.com' },
    userProjection
  ).populate('cartItems.product', productProjection)
  console.log(JSON.stringify(retrievedUser, null, 2))

  const order: Order = {
    date: new Date('2026-01-01'),
    address: 'Calle Juan Jose, 1',
    cardHolder: 'john',
    cardNumber: '85857573489390',
    orderitems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
        price: 39.95,
      },
    ],
  }
  const resO = await Orders.create(order)
  console.log(JSON.stringify(resO, null, 2))

  const buyer = await Users.findOne({
    email: 'johndoe@example.com',
  })
  console.log(JSON.stringify(buyer, null, 2))

  buyer?.orders.push(resO._id)
  await buyer?.save()

  const Newbuyer = await Users.findOne({
    email: 'johndoe@example.com',
  })
  console.log(JSON.stringify(Newbuyer, null, 2))
  await conn.disconnect()
}

seed().catch(console.error)
