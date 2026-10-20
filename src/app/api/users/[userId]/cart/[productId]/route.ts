import { Types } from 'mongoose'
import{getProduct, getUser, putProduct,putProductresponse,GetCartUserResponse, deleteProduct, DeleteCartUserResponse} from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse } from '@/lib/handlers'
import { getSession } from '@/lib/auth'

type PutProductApiResponse = Omit<putProductresponse, 'encontrado'>

export async function DELETE(
 request: NextRequest,
 { params }: { params: { userId: string, productId: string }}
): Promise<NextResponse<DeleteCartUserResponse> | NextResponse<ErrorResponse>> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    )
  }
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Product ID.',
      },
      { status: 400 }
    )
  }

 const cartItems = await deleteProduct(params.userId, params.productId)
 if ((cartItems as unknown) === 'UserNotFound'){
   return NextResponse.json(
      {
        error: 'InvalidUser',
        message: 'User not found.',
      },
      { status: 404 }
    )
 }

  if ((cartItems as unknown) === 'ProductNotFound'){
   return NextResponse.json(
      {
        error: 'InvalidProduct',
        message: 'Product not found.',
      },
      { status: 404 }
    )
 }



 

 return NextResponse.json(cartItems as DeleteCartUserResponse)
}

export async function PUT (request: NextRequest,
 { params }: { params: { userId: string, productId: string }}
): Promise<NextResponse<PutProductApiResponse> | NextResponse<ErrorResponse>> {

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
  const body = await request.json()
   if (
    !body.qty
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

   if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    )
  }
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Product ID.',
      },
      { status: 400 }
    )
    
  }

  if(body.qty<=0){

    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid quantity',
      },
      { status: 400 }
    )
  }
  const user = getUser(params.userId)
  if(user == null){

    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found',
      },
      { status: 404 }
    )
  }

   const product = getProduct(params.productId)
  if(product == null){

    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Product not found',
      },
      { status: 404 }
    )
  }
  
  const response = await putProduct(params.userId, body, params.productId)

  if (response === null){
    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Unable to update product.',
      },
      { status: 500 }
    )
  }

  const { encontrado, ...responseBody } = response

  if (encontrado){

    return NextResponse.json(responseBody)

  }
  else{

    const headers = new Headers()
    headers.append('Location', `/api/users/${params.userId}/cart/${params.productId}`)
    return NextResponse.json(responseBody, { status: 201, headers: headers })
  }

}