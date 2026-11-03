import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCartUser, getProduct } from '@/lib/handlers'
import { getSession } from '@/lib/auth'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Product as ProductModel } from '@/models/Product'

interface CartItemPopulated {
  product: ProductModel & { _id: Types.ObjectId }
  qty: number
}

export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  const [product, session] = await Promise.all([
    getProduct(params.productId),
    getSession(),
  ])
  if (!product) {
    notFound()
  }

  let quantity = 0
  if (session) {
    const cart = await getCartUser(session.userId)
    const cartItem = (cart?.cartItems as CartItemPopulated[] | undefined)?.find(
      (item) => item.product._id.toString() === params.productId
    )
    quantity = cartItem?.qty ?? 0
  }

  return (
    <div className='mx-auto max-w-5xl'>
      <Link
        href='/'
        className='mb-8 inline-block text-sm font-semibold text-[#a14d32] hover:underline'
      >
        ← Back to catalogue
      </Link>
      <div className='grid overflow-hidden rounded-2xl border border-[#e8d9c5] bg-white shadow-sm md:grid-cols-2'>
        <div className='bg-[#f7efe3] p-6 sm:p-10'>
          <div className='mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-lg bg-white shadow-sm'>
            <img
              src={product.img}
              alt={`Cover of ${product.name}`}
              className='h-full w-full object-cover'
            />
          </div>
        </div>

        <div className='flex flex-col p-6 sm:p-10'>
          <p className='text-xs font-bold uppercase tracking-[0.25em] text-[#a14d32]'>
            Book details
          </p>
          <h1 className='mt-3 text-3xl font-bold leading-tight text-[#3d3028] sm:text-4xl'>
            {product.name}
          </h1>
          <p className='mt-5 text-2xl font-semibold text-[#a14d32]'>
            {product.price.toFixed(2)} €
          </p>

          {product.description && (
            <div className='mt-8 border-t border-[#e8d9c5] pt-6'>
              <h2 className='text-sm font-bold uppercase tracking-wide text-[#6d584a]'>
                Description
              </h2>
              <p className='mt-3 text-sm leading-7 text-[#6d584a]'>
                {product.description}
              </p>
            </div>
          )}

          {session && (
            <div className='mt-auto border-t border-[#e8d9c5] pt-6'>
              <p className='mb-3 text-sm font-semibold text-[#3d3028]'>
                In your cart
              </p>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  aria-label='Remove one item'
                  className='rounded-md border border-[#e8d9c5] p-2 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32]'
                >
                  <MinusIcon className='h-5 w-5' aria-hidden='true' />
                </button>
                <span className='min-w-10 text-center text-base font-semibold text-[#3d3028]'>
                  {quantity}
                </span>
                <button
                  type='button'
                  aria-label='Add one item'
                  className='rounded-md border border-[#e8d9c5] p-2 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32]'
                >
                  <PlusIcon className='h-5 w-5' aria-hidden='true' />
                </button>
                <button
                  type='button'
                  aria-label='Remove product from cart'
                  className='ml-2 rounded-md bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200'
                >
                  <TrashIcon className='h-5 w-5' aria-hidden='true' />
                </button>
              </div>
              <p className='mt-3 text-xs text-[#8b7565]'>
                Cart controls are shown for preview only in this practice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
