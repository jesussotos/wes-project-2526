import { Types } from 'mongoose'
import{getOrder, getUser, GetOrderResponse, CreateOrderResponse, createOrder} from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

export async function GET(
 request: NextRequest,
 { params }: { params: { userId: string } }
): Promise<NextResponse<GetOrderResponse> | NextResponse<ErrorResponse>> {
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
 const orders = await getOrder(params.userId)
 return NextResponse.json(orders)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string }}
): Promise<NextResponse<CreateOrderResponse> | NextResponse<ErrorResponse>> {
  const body = await request.json()

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

  if (
    !body.address ||
    !body.cardHolder ||
    !body.cardNumber ||
    !Types.ObjectId.isValid(params.userId)
  ) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Request parameters are wrong or missing.',
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

  const orderId = await createOrder(params.userId,body)


  if (orderId === null) {
    return NextResponse.json(
      {
        error: 'FAIL',
        message: 'This Card Number already exists.',
      },
      { status: 400 }
    )
  }

  const headers = new Headers()
  headers.append('Location', `/api/users/${params.userId}/orders/${orderId._id}`)
  return NextResponse.json(orderId, { status: 201, headers: headers })
}