import { redirect } from 'next/navigation'
import { getCartUser } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Product } from '@/models/Product'
import { Types } from 'mongoose'

interface CartItemPopulated {
  product: Product & { _id: Types.ObjectId }
  qty: number
}

export default async function Checkout() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const cartItemsData = await getCartUser(session.userId)
  if (!cartItemsData) {
    redirect('/auth/signin')
  }

  const cartItems = cartItemsData.cartItems as CartItemPopulated[]

  let total = 0
  for (const cartItem of cartItems) {
    total += cartItem.product.price * cartItem.qty
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Checkout
      </h3>
      {cartItems.length === 0 && (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      )}
      {cartItems.length > 0 && (
        <>
          <div className='overflow-hidden rounded-lg border border-[#e8d9c5] bg-white shadow-sm'>
            <table className='min-w-full divide-y divide-[#e8d9c5] text-sm text-[#3d3028]'>
              <thead>
                <tr className='text-left text-xs font-semibold uppercase tracking-wide text-[#6d584a]'>
                  <th scope='col' className='px-4 py-3'>
                    Product name
                  </th>
                  <th scope='col' className='px-4 py-3 text-center'>
                    Quantity
                  </th>
                  <th scope='col' className='px-4 py-3 text-right'>
                    Price
                  </th>
                  <th scope='col' className='px-4 py-3 text-right'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#e8d9c5]'>
                {cartItems.map((cartItem) => (
                  <tr key={cartItem.product._id.toString()}>
                    <td className='px-4 py-3'>
                      <Link
                        href={`/products/${cartItem.product._id.toString()}`}
                        className='hover:text-[#a14d32]'
                      >
                        {cartItem.product.name}
                      </Link>
                    </td>
                    <td className='px-4 py-3 text-center'>{cartItem.qty}</td>
                    <td className='whitespace-nowrap px-4 py-3 text-right'>
                      {cartItem.product.price.toFixed(2) + ' €'}
                    </td>
                    <td className='whitespace-nowrap px-4 py-3 text-right'>
                      {(cartItem.product.price * cartItem.qty).toFixed(2) +
                        ' €'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className='border-t border-[#e8d9c5]'>
                <tr className='font-semibold'>
                  <td className='px-4 py-3' colSpan={3}>
                    Total
                  </td>
                  <td className='whitespace-nowrap px-4 py-3 text-right'>
                    {total.toFixed(2) + ' €'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <form className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-[#3d3028]'
              >
                Shipping address
              </label>
              <input
                id='address'
                name='address'
                type='text'
                placeholder='221B Baker Street, London, UK'
                className='mt-1 block w-full rounded-md border border-[#e8d9c5] bg-white px-3 py-2 text-sm text-[#3d3028] 
                placeholder:text-[#b8a593] focus:border-[#a14d32] focus:outline-none focus:ring-1 focus:ring-[#a14d32]'
              />
            </div>
            <div>
              <label
                htmlFor='cardHolder'
                className='block text-sm font-medium text-[#3d3028]'
              >
                Card Holder
              </label>
              <input
                id='cardHolder'
                name='cardHolder'
                type='text'
                placeholder='Foo Bar'
                className='mt-1 block w-full rounded-md border border-[#e8d9c5] bg-white px-3 py-2 text-sm text-[#3d3028] 
                placeholder:text-[#b8a593] focus:border-[#a14d32] focus:outline-none focus:ring-1 focus:ring-[#a14d32]'
              />
            </div>
            <div>
              <label
                htmlFor='cardNumber'
                className='block text-sm font-medium text-[#3d3028]'
              >
                Card Number
              </label>
              <input
                id='cardNumber'
                name='cardNumber'
                type='text'
                inputMode='numeric'
                placeholder='0000111122223333'
                className='mt-1 block w-full rounded-md border border-[#e8d9c5] bg-white px-3 py-2 text-sm text-[#3d3028] 
                placeholder:text-[#b8a593] focus:border-[#a14d32] focus:outline-none focus:ring-1 focus:ring-[#a14d32]'
              />
            </div>
            <div className='mt-2 flex justify-center sm:col-span-2'>
              <button
                type='button'
                className='w-full rounded-full bg-[#a14d32] px-6 py-2 text-sm font-semibold text-white transition-colors 
                hover:bg-[#873d27] sm:w-auto'
              >
                Purchase
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}