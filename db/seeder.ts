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
    name: 'Así es la puta vida, Jordi Wild',
    price: 21.75,
    img: '/img/PutaVida.jpg',
    description: 'Described as an "anti-self-help" book. Wild criticizes the guru and self-help industry, arguing that there are no magic recipes for happiness and that life involves a daily struggle that must be accepted with realism and optimism.',
  },
  {
    name: 'Cocina para todos, Karlos Arguiñano',
    price: 25.90,
    img: '/img/CocinaParaTodos.jpg',
    description: 'The cookbook includes a wide variety of dishes organized into sections: starters, salads, soups, vegetables, legumes, eggs, rice, pasta, meat, fish, and desserts. It also features family collaboration, as 85 recipes are signed by his son Joseba Arguiñano and 56 desserts by his sister Eva.',
  },
  {
    name: 'El libro troll, Rubius',
    price: 15.90,
    img: '/img/libroTroll.jpg',
    description: 'This is an interactive comic for a young audience over 12, full of mischief, humor, and spontaneity, created by a mass phenomenon on social media, the extraordinary YouTuber El Rubius. The Troll Book is his latest comic: an activity book and a scrapbook. Elrubius invites you to turn your life into an experiment and tell its story on the pages of this mischievous miscellany.',
  },

  {
    name: 'Anotop At, Alberto Núñez Feijoo',
    price: 35.90,
    img: '/img/AnotopAt.jpg',
    description: 'This book is inspired by a documentary created and directed by politician Alberto Núñez Feijoo. In this book, through the author’s account, we will learn all the ins and outs of the presidency of the government, as well as read a brilliant prologue about the author’s relationship with a figure as well known as Marcial Dorado.',
  },

  {
    name: 'Jotadé, Santiago Díaz',
    price: 24.90,
    img: '/img/Jotade.jpg',
    description: 'Jotadé, by Santiago Díaz, is a crime novel published in 2025 that begins a new series starring Deputy Inspector Juan de Dios Cortés, known as Jotadé. The plot begins in Madrid when two men are disemboweled and thrown from an M-30 bridge, causing an accident in which the daughter of the Homicide Commissioner dies.',
  },

  {
    name: 'El problema final, Arturo Pérez Reverte',
    price: 26.90,
    img: '/img/ProblemaFinal.jpg',
    description: 'A violent storm leaves nine people isolated in a hotel on the Greek island of Utakos, off Corfu. When English tourist Edith Mander is found dead in a beach pavilion, what appears to be a suicide is revealed to be an impossible crime by Hopalong Basil, a declining actor who played the famous detective in the cinema.',
  },

  {
    name: 'El niño que perdió la guerra, Julia Navarro',
    price: 29.90,
    img: '/img/ElniñoquePerdiolaGuerra.jpg',
    description: 'Madrid, winter 1938: During the final months of the Spanish Civil War, the fall of the Second Republic is imminent. Clotilde, a graphic artist who draws for republican newspapers, watches as her husband —a communist militant linked to the Soviets— decides to send their five-year-old son, Pablo, to Moscow against her will. Commander Boris Petrov takes the child across a Spain consumed by the conflict.',
  },

  {
    name: 'Invisible, Eloy Moreno',
    price: 19.90,
    img: '/img/Invisible.jpg',
    description: 'Eloy Moreno’s book Invisible is about bullying, loneliness, fear, and social indifference, seen through the eyes of a child who is in a hospital recovering from a serious incident.',
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
