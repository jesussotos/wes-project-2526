import { Types } from 'mongoose'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrderId } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

function formatPrice(price: number) {
  return `${price.toFixed(2)} €`
}

function maskCardNumber(cardNumber: string) {
  const visibleDigits = cardNumber.slice(-4)
  return `•••• •••• •••• ${visibleDigits}`
}

export default async function OrderDetails({
  params,
}: {
  params: { orderId: string }
}) {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/auth/signin')
  }

  if (!Types.ObjectId.isValid(params.orderId)) {
    notFound()
  }

  const order = await getOrderId(session.userId, params.orderId)
  if (order === null) {
    notFound()
  }

  const total = order.orderitems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  return (
    <section className='mx-auto max-w-5xl'>
      <div className='mb-8'>
        <p className='mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#a14d32]'>
          Order details
        </p>
        <h2 className='text-3xl font-bold text-[#3d3028] sm:text-4xl'>
          Your order
        </h2>
      </div>

      <div className='mb-8 grid gap-4 rounded-xl border border-[#e8d9c5] bg-white p-5 text-sm sm:grid-cols-2 sm:p-6'>
        <div>
          <dt className='font-semibold text-[#6d584a]'>Order ID</dt>
          <dd className='mt-1 break-all text-[#3d3028]'>
            {order._id.toString()}
          </dd>
        </div>
        <div>
          <dt className='font-semibold text-[#6d584a]'>Date</dt>
          <dd className='mt-1 text-[#3d3028]'>
            {new Date(order.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </dd>
        </div>
        <div>
          <dt className='font-semibold text-[#6d584a]'>Shipping address</dt>
          <dd className='mt-1 text-[#3d3028]'>{order.address}</dd>
        </div>
        <div>
          <dt className='font-semibold text-[#6d584a]'>Payment information</dt>
          <dd className='mt-1 text-[#3d3028]'>
            {order.cardHolder} · {maskCardNumber(order.cardNumber)}
          </dd>
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border border-[#e8d9c5] bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[600px] text-left text-sm'>
            <thead className='bg-[#f7efe3] text-xs uppercase tracking-wide text-[#6d584a]'>
              <tr>
                <th scope='col' className='px-5 py-4 font-semibold'>
                  Product
                </th>
                <th scope='col' className='px-5 py-4 text-right font-semibold'>
                  Quantity
                </th>
                <th scope='col' className='px-5 py-4 text-right font-semibold'>
                  Price
                </th>
                <th scope='col' className='px-5 py-4 text-right font-semibold'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#eee2d3] text-[#3d3028]'>
              {order.orderitems.map((item) => (
                <tr key={item.product._id.toString()}>
                  <td className='px-5 py-4'>
                    <Link
                      href={`/products/${item.product._id.toString()}`}
                      className='font-medium text-[#a14d32] hover:underline'
                    >
                      {item.product.name}
                    </Link>
                  </td>
                  <td className='px-5 py-4 text-right'>{item.qty}</td>
                  <td className='px-5 py-4 text-right'>
                    {formatPrice(item.price)}
                  </td>
                  <td className='px-5 py-4 text-right font-medium'>
                    {formatPrice(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className='border-t border-[#e8d9c5]'>
              <tr>
                <th
                  scope='row'
                  colSpan={3}
                  className='px-5 py-4 text-right text-base font-bold text-[#3d3028]'
                >
                  Total
                </th>
                <td className='px-5 py-4 text-right text-base font-bold text-[#a14d32]'>
                  {formatPrice(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}
