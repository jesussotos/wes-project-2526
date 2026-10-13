import { getProducts, GetProductsResponse } from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'
import Users, { User } from '@/models/User'

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetProductsResponse>> {
  const products = await getProducts()

  return NextResponse.json(products)
}
export interface ErrorResponse {
  error: string
  message: string
}

export interface CreateUserResponse {
  _id: Types.ObjectId
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}