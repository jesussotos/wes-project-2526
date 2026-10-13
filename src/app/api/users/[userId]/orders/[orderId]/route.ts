import { Types } from 'mongoose'
import{getOrderId, getUser, GetOrderIdResponse} from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse } from '@/lib/handlers'

export async function GET(
 request: NextRequest,
 { params }: { params: { userId: string, orderId: string} }
): Promise<NextResponse<GetOrderIdResponse> | NextResponse<ErrorResponse>> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
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