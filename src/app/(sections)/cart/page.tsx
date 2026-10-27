import { redirect } from 'next/navigation'
import { getCartUser } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Product } from '@/models/Product'
import { Types } from 'mongoose'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface CartItemPopulated {
  product: Product & { _id: Types.ObjectId }
  qty: number
}

export default async function Cart() {
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
        My Shopping Cart
      </h3>
      {cartItems.length === 0 && (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      )}
      {cartItems.length > 0 && (
        <>
          <div className='mx-auto w-full max-w-3xl rounded-lg border border-[#e8d9c5] bg-white p-4 shadow-sm sm:p-6'>
            <ul className='divide-y divide-[#e8d9c5]'>
              {cartItems.map((cartItem) => (
                <li
                  key={cartItem.product._id.toString()}
                  className='flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:gap-6'
                >
                  <Link
                    href={`/products/${cartItem.product._id.toString()}`}
                    className='group flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6'
                  >
                    <div className='w-full flex-shrink-0 overflow-hidden rounded-md bg-gray-200 sm:w-32'>
                      <img
                        src={cartItem.product.img}
                        alt={cartItem.product.name}
                        className='aspect-[2/1] h-full w-full object-cover object-center group-hover:opacity-75'
                      />
                    </div>
                    <span className='text-sm text-[#3d3028] group-hover:text-[#a14d32]'>
                      {cartItem.product.name}
                    </span>
                  </Link>
                  <div className='flex flex-col items-end gap-1 self-end sm:self-center'>
                    <span className='text-base font-semibold text-[#3d3028]'>
                      {(cartItem.product.price * cartItem.qty).toFixed(2) +
                        ' €'}
                    </span>
                    <span className='text-xs text-[#6d584a]'>
                      {'Per unit: ' + cartItem.product.price.toFixed(2) + ' €'}
                    </span>
                    <div className='mt-1 flex items-center gap-1'>
                      <button
                        type='button'
                        className='rounded-md border border-[#e8d9c5] p-1 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] 
                        hover:text-[#a14d32]'
                      >
                        <span className='sr-only'>Remove one item</span>
                        <MinusIcon className='h-4 w-4' aria-hidden='true' />
                      </button>
                      <span className='w-8 text-center text-sm text-[#3d3028]'>
                        {cartItem.qty}
                      </span>
                      <button
                        type='button'
                        className='rounded-md border border-[#e8d9c5] p-1 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] 
                        hover:text-[#a14d32]'
                      >
                        <span className='sr-only'>Add one item</span>
                        <PlusIcon className='h-4 w-4' aria-hidden='true' />
                      </button>
                      <button
                        type='button'
                        className='ml-1 rounded-md bg-red-100 p-1 text-red-600 transition-colors hover:bg-red-200'
                      >
                        <span className='sr-only'>Remove product</span>
                        <TrashIcon className='h-4 w-4' aria-hidden='true' />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className='flex justify-end gap-4 border-t border-[#e8d9c5] pt-4 text-base text-[#3d3028]'>
              <span>Total:</span>
              <span className='font-semibold'>{total.toFixed(2) + ' €'}</span>
            </div>
          </div>
          <div className='mt-8 flex justify-center'>
            <Link
              href='/checkout'
              className='rounded-full bg-[#a14d32] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#873d27]'
            >
              Check out
            </Link>
          </div>
        </>
      )}
    </div>
  )
}