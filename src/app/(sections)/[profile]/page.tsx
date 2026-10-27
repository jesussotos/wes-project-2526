import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOrder, getUser } from "@/lib/handlers";
import Link from "next/link";
import {CakeIcon, EnvelopeIcon, MapPinIcon, UserIcon} from '@heroicons/react/24/solid'

function maskCardNumber(cardNumber: string) {
  const visibleDigits = cardNumber.slice(-4)
  return `•••• •••• •••• ${visibleDigits}`
}

export default async function Profile() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const userData = await getUser(session.userId)
  const orderData = await getOrder(session.userId)

  if (!userData || !orderData) {
    redirect('/auth/signin')
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        User Profile
      </h3>
      <div>
        <p className='flex items-center gap-2'>
          <UserIcon className='h-4 w-4' />
          <strong>Full name: </strong>
          {userData.name} {userData.surname}
        </p>
        <p className='flex items-center gap-2'>
          <EnvelopeIcon className='h-4 w-4' />
          <strong>E-mail address: </strong>
          {userData.email}
        </p>
        <p className='flex items-center gap-2'>
          <MapPinIcon className='h-4 w-4' />
          <strong>Address: </strong>
          {userData.address}
        </p>
        <p className='flex items-center gap-2'>
          <CakeIcon className='h-4 w-4' />
          <strong>Birthdate: </strong>
          {userData.birthdate.toLocaleDateString()}
        </p>
      </div>
      <h3 className='pb-4 pt-8 text-2xl font-bold text-gray-900'>
        Orders
      </h3>
      {orderData.orders.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>No orders yet</span>
        </div>
      ) : (
        <>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead className='border-b border-gray-200 bg-gray-50 text-xs text-gray-600'>
                <tr>
                  <th className='px-4 py-3 font-semibold uppercase'>
                    Order ID
                  </th>
                  <th className='px-4 py-3 font-semibold uppercase'>
                    Shipment address
                  </th>
                  <th className='px-4 py-3 font-semibold uppercase'>
                    Payment information
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.orders.map((order) => (
                    <tr
                      key={order._id.toString()}
                      className='border-b border-gray-100 last:border-0'
                    >
                      <td className='px-4 py-3'>
                        <Link href={`/orders/${order._id.toString()}`}>
                          {order._id.toString()}
                        </Link>
                      </td>
                      <td className='px-4 py-3'>{order.address}</td>
                      <td className='px-4 py-3'>
                        <div>{order.cardHolder}</div>
                        <div>{maskCardNumber(order.cardNumber)}</div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}