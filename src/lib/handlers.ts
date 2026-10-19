import Products, { Product } from '@/models/Product'
import Orders, { Order } from '@/models/Order'
import connect from '@/lib/mongoose'
import { Types } from 'mongoose'
import Users, { User } from '@/models/User'
import bcrypt from 'bcrypt'

const ProductProjection = {
  name: true,
  price: true,
  img: true,
  description: true,
}

const productsProjection = {
  __v: false,
}

const cartUserProjection = {
  _id: true,
  cartItems: {
    product: true,
    qty: true,
  },
}
const cartdeleteUserProjection = {
  _id: false,
  cartItems: {
    product: true,
    qty: true,
  },
}
export interface GetProductsResponse {
  products: (Product & { _id: Types.ObjectId })[]
}
export interface ErrorResponse {
  error: string
  message: string
}
// ============================================================================
// GET /api/products
// Retrieve the list of products.
// ============================================================================
export async function getProducts(): Promise<GetProductsResponse> {
  await connect()

  const productsProjection = {
    __v: false,
  }
  const products = await Products.find({}, productsProjection)

  return {
    products,
  }
}
export interface CreateUserResponse {
  _id: Types.ObjectId
}

// ============================================================================
// POST /api/users
// Create a new user.
// ============================================================================
export async function createUser(user: {
  email: string
  password: string
  name: string
  surname: string
  address: string
  birthdate: Date
}): Promise<CreateUserResponse | null> {
  await connect()

  const prevUser = await Users.find({ email: user.email })

  if (prevUser.length !== 0) {
    return null
  }

  const hash = await bcrypt.hash(user.password, 10)
  const doc: User = {
    ...user,
    password: hash,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  }

  const newUser = await Users.create(doc)

  return {
    _id: newUser._id,
  }
}
export interface GetUserResponse extends Pick<
  User,
  'email' | 'name' | 'surname' | 'address' | 'birthdate'
> {
  _id: Types.ObjectId
}

// ============================================================================
// GET /api/users/[userId]
// Retrieve the details of an existing user.
// ============================================================================
export async function getUser(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> {
  await connect()

  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  }
  const user = await Users.findById(userId, userProjection)

  return user
}

// Get CartUser

export interface GetCartUserResponse extends Pick<User, 'cartItems'> {
  _id: Types.ObjectId
}
// ============================================================================
// GET /api/users/[userId]/cart
// Retrieve the list of cart items of an existing user.
// ============================================================================
export async function getCartUser(
  userId: Types.ObjectId | string
): Promise<GetCartUserResponse | null> {
  await connect()

  const userCart = await Users.findById(userId, cartUserProjection).populate(
    'cartItems.product',
    productsProjection
  )

  return userCart
}

//get product/product[id]

export interface GetProductResponse extends Pick<
  Product,
  'name' | 'price' | 'img' | 'description'
> {
  _id: Types.ObjectId
}
// ============================================================================
// GET /api/products/[productId]
// Retrieve the details of a product.
// ============================================================================
export async function getProduct(
  ProductId: Types.ObjectId | string
): Promise<GetProductResponse | null> {
  await connect()

  const product = await Products.findById(ProductId, ProductProjection)
  return product
}

//getOrder

export interface GetOrderResponse {
  orders: Order[]
}
// ============================================================================
// GET /api/users/[userId]/orders
// Retrieve the list of orders of an existing user.
// ============================================================================
export async function getOrder(
  userId: Types.ObjectId | string
): Promise<GetOrderResponse | null> {
  await connect()

  const orderUserProjection = {
    _id: false,
    orders: true,
  }

  const orderProjection = {
    __v: false,
  }

  const order = await Users.findById(userId, orderUserProjection).populate({
    path: 'orders',
    model: Orders,
    select: orderProjection,
  })

  return order
}

export interface DeleteCartUserResponse {
  cartItems: { product: Product; qty: number }[]
}
// ============================================================================
// DELETE /api/users/[userId]/cart/[productId]
// Remove a product from the cart of an existing user.
// ============================================================================
export async function deleteProduct(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string
): Promise<DeleteCartUserResponse | ErrorResponse> {
  await connect()

  const userCart = await Users.findById(userId)
  if (userCart == null) {
    return {
      error: 'UserNotFound',
      message: 'User not found',
    }
  }

  const cartItem = userCart?.cartItems.find((cartItem) =>
    cartItem.product._id.equals(productId)
  )

  if (cartItem == null) {
    return {
      error: 'ProductNotFound',
      message: 'Product not found',
    }
  }

  userCart?.cartItems.splice(userCart?.cartItems.indexOf(cartItem!), 1)

  userCart?.save()

  const response = await userCart.populate<{
    cartItems: { product: Product; qty: number }[]
  }>('cartItems.product', productsProjection)

  return { cartItems: response.cartItems }
}

export interface GetOrderIdResponse extends Omit<Order, 'orderitems'> {
  _id: Types.ObjectId
  orderItems: (Omit<Order['orderitems'][number], 'product'> & {
    product: Product & { _id: Types.ObjectId }
  })[]
}

// ============================================================================
// GET /api/users/[userId]/orders
// Retrieve the list of orders of an existing user.
// ============================================================================
export async function getOrderId(
  userId: Types.ObjectId | string,
  orderId: Types.ObjectId | string
): Promise<GetOrderIdResponse | null> {
  await connect()

  const user = await Users.findById(userId, { orders: true })

  const response = await Orders.findOne({
    _id: { $eq: orderId, $in: user.orders },
  })
    .select({ __v: false })
    .populate({
      path: 'orderitems.product',
      model: Products,
      select: ProductProjection,
    })

  if (!response) {
    return null
  }

  return response
}

export interface CreateOrderResponse {
  _id: Types.ObjectId
}

// ============================================================================
// POST /api/users/[userId]/orders
// Create a new order for an existing user.
// ============================================================================
export async function createOrder(
  userId,
  order: {
    address: string
    cardHolder: string
    cardNumber: string
  }
): Promise<CreateOrderResponse | null> {
  await connect()

  const doc: Order = {
    ...order,
    date: new Date(),
    orderitems: [],
  }

  const newOrder = await Orders.create(doc)
  const user = await Users.findById(userId)
  user?.orders.push(newOrder)
  user?.save()

  return {
    _id: newOrder._id,
  }
}

export interface putProductresponse extends Pick<User, 'cartItems'> {
  _id: Types.ObjectId
  encontrado: boolean
}

// ============================================================================
// PUT /api/users/[userId]/cart/[productId]
// Modify the number of items of a given product in the cart of an existing user.
// ============================================================================
export async function putProduct(
  userId: Types.ObjectId | string,
  product: {
    qty: number
  },
  productId: Types.ObjectId | string
): Promise<putProductresponse | null> {
  await connect()

  const userCartp = await Users.findById(userId)
  const productp = await Products.findById(productId)
  let encontrado = false

  if (userCartp === null || productp === null) {
    return null
  }

  const productCart = userCartp.cartItems.find((cartItem) =>
    cartItem.product.equals(productId)
  )

  if (productCart == null) {
    userCartp.cartItems.push({
      product: productp._id,
      qty: product.qty,
    })
    encontrado = false
  } else {
    productCart.qty = product.qty
    encontrado = true
  }

  await userCartp.save()

  const userCart = await Users.findById(userId, cartUserProjection).populate(
    'cartItems.product',
    productsProjection
  )

  return { _id: userCart, encontrado: encontrado }
}

export interface CheckCredentialsResponse {
  _id: Types.ObjectId
}

export async function checkCredentials(
  email: string,
  password: string
): Promise<CheckCredentialsResponse | null> {
  await connect()

  const user = await Users.findOne({ email: email })

  if (!user) {
    return null
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return null
  }

  return { _id: user.id }
}
