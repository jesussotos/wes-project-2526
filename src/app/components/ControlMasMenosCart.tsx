'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ControlMasMenosCartProps {
  userId: string
  productId: string
  value: number
}

export default function CartControlCant({
  userId,
  productId,
  value,
}: ControlMasMenosCartProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateQty = async function (qty: number) {
    setIsUpdating(true)

    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: qty,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const onPlusBtnClick = () => updateQty(value + 1)
  const onMinusBtnClick = () => updateQty(value - 1)

  return (
    <div className='mt-1 flex items-center gap-1'>
      <button
        type='button'
        className='rounded-md border border-[#e8d9c5] p-1 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32] disabled:cursor-not-allowed disabled:opacity-40'
        onClick={onMinusBtnClick}
        disabled={isUpdating || value <= 1}
      >
        <span className='sr-only'>Remove one item</span>
        <MinusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
      <span className='w-8 text-center text-sm text-[#3d3028]'>{value}</span>
      <button
        type='button'
        className='rounded-md border border-[#e8d9c5] p-1 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32] disabled:cursor-not-allowed disabled:opacity-40'
        onClick={onPlusBtnClick}
        disabled={isUpdating}
      >
        <span className='sr-only'>Add one item</span>
        <PlusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
    </div>
  )
}