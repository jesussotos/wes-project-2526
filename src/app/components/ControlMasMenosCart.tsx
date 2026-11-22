'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ControlMasMenosCart {
  inicial: number
}

export default function CartControlCant({
  inicial: cantIni,
}: ControlMasMenosCart) {
  const [quantity, setQuantity] = useState(cantIni)

  return (
    <div className='mt-1 flex items-center gap-1'>
      <button
        type='button'
        className='rounded-md border border-[#e8d9c5] p-1 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32]'
        onClick={() =>
          setQuantity((actual) => Math.max(1, actual - 1))
        }
      >
        <span className='sr-only'>Remove one item</span>
        <MinusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
      <span className='w-8 text-center text-sm text-[#3d3028]'>{quantity}</span>
      <button
        type='button'
        className='rounded-md border border-[#e8d9c5] p-1 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32]'
        onClick={() => setQuantity((actual) => actual + 1)}
      >
        <span className='sr-only'>Add one item</span>
        <PlusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
    </div>
  )
}
