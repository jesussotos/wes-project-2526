import { Types } from 'mongoose'
import{getOrderId, getUser, GetOrderIdResponse} from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

export async function GET(
 request: NextRequest,
 { params }: { params: { userId: string, orderId: string} }
): Promise<NextResponse<GetOrderIdResponse> | NextResponse<ErrorResponse>> {
  const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json(
        {
          error: 'NOT_AUTHENTICATED',
          message: 'Authentication required.',
        },
        { status: 401 }
      )
    }
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    )
  }

  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      {
        error: 'NOT_AUTHORIZED',
        message: 'Unauthorized access.',
      },
      { status: 403 }
    )
  }

  if (!Types.ObjectId.isValid(params.orderId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid order ID.',
      },
      { status: 400 }
    )
  }

  const user = await getUser(params.userId)

  if (user === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    )
  }
 const orders = await getOrderId(params.userId, params.orderId)

if (orders === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Order not found.',
      },
      { status: 404 }
    )
  }

 return NextResponse.json(orders)
}