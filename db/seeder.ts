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
    description: 'Descrito como un libro de "anti-autoayuda".  Wild critica la industria de los gurús y la autoayuda, argumentando que no hay recetas mágicas para la felicidad y que la vida implica una lucha diaria que debe aceptarse con realismo y optimismo.',
  },
  {
    name: 'Cocina para todos, Karlos Arguiñano',
    price: 25.90,
    img: '/img/CocinaParaTodos.jpg',
    description: 'El recetario incluye una amplia variedad de platos organizados por secciones: entrantes, ensaladas, sopas, verduras, legumbres, huevos, arroces, pastas, carnes, pescados y postres. Además, cuenta con la colaboración familiar, ya que 85 recetas están firmadas por su hijo Joseba Arguiñano y 56 postres por su hermana Eva.',
  },
  {
    name: 'El libro troll, Rubius',
    price: 15.90,
    img: '/img/libroTroll.jpg',
    description: 'Este es un comic interactivo para un público juvenil mayor de 12 años con mucho gamberrismo, humor y espontaneidad, de la mano de un fenómeno de masas en las redes sociales, el extraordinario YouTuber, El Rubius. El libro troll es su último cómic: un cuaderno de actividades, un álbum de recuerdos. Elrubius te propone hacer de tu vida un experimento y contarlo en las páginas de este cajón de sastre gamberro.',
  },

  {
    name: 'Anotop At, Alberto Núñez Fijoo',
    price: 35.90,
    img: '/img/AnotopAt.jpg',
    description: 'Este libro se inspira en un documental, creado y dirigido por el político Alberto Núñez Feijoo. En este libro conoceremos de la mano del autor todos los entresijos de la presidencia del gobierno, además de contar con un brillante prólogo sobre como fué la relación del autor con una figura tan conocida como la de Marcial Dorado',
  },

  {
    name: 'Jotadé, Santiago Díaz',
    price: 24.90,
    img: '/img/Jotade.jpg',
    description: 'Jotadé, de Santiago Díaz, es una novela negra publicada en 2025 que inicia una nueva serie protagonizada por el subinspector Juan de Dios Cortés, conocido como Jotadé.  La trama se inicia en Madrid cuando dos hombres son destripados y lanzados desde un puente de la M-30, provocando un accidente donde muere la hija del comisario de Homicidios',
  },

  {
    name: 'El problema final, Arturo Pérez Reverte',
    price: 26.90,
    img: '/img/ProblemaFinal.jpg',
    description: 'Un violento temporal deja aisladas a nueve personas en el hotel de la isla griega de Utakos, frente a Corfú.  Cuando la turista inglesa Edith Mander es hallada muerta en un pabellón de la playa, lo que parece un suicidio es revelado como un crimen imposible por Hopalong Basil, un actor en decadencia que interpretó al célebre detective en el cine',
  },

  {
    name: 'El niño que perdió la guerra, Julia Navarro',
    price: 29.90,
    img: '/img/ElniñoquePerdiolaGuerra.jpg',
    description: 'Madrid, invierno de 1938: En los últimos meses de la Guerra Civil española, la caída de la Segunda República es inminente. Clotilde, una artista gráfica que dibuja para diarios republicanos, ve cómo su marido —un militante comunista vinculado a los soviéticos— decide enviar a Moscú a su hijo de cinco años, Pablo, en contra de la voluntad de ella. El comandante Borís Petrov se lleva al niño a través de una España devorada por el conflicto',
  },

  {
    name: 'Invisible, Eloy Moreno',
    price: 19.90,
    img: '/img/Invisible.jpg',
    description: 'El libro Invisible de Eloy Moreno trata sobre el acoso escolar (bullying), la soledad, el miedo y la indiferencia social, visto a través de los ojos de un niño que se encuentra en un hospital recuperándose de un grave suceso',
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
