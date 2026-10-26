import {
  ArrowRightStartOnRectangleIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import NavbarButton from '@/components/NavbarButton'
import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className='fixed top-0 z-50 w-full border-b border-[#e8d9c5] bg-[#fffaf3]/95 text-[#3d3028] shadow-sm backdrop-blur-lg backdrop-filter'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex items-center'>
            <Link
              className='flex flex-shrink-0 items-center gap-3 text-[#3d3028] transition-colors hover:text-[#a14d32]'
              href='/'
            >
              <img
                className='block h-14 w-auto'
                src='/img/logo.png'
                alt='DuViSo Books logo'
              />
              <div className='font-serif text-2xl font-bold tracking-tight'>
                DuViSo <span className='font-normal text-[#a14d32]'>Books</span>
              </div>
            </Link>
          </div>
          <div className='flex items-center gap-2 sm:gap-4'>
            {session ? (
              <>
                <NavbarButton href='/cart'>
                  <span className='sr-only'>Cart</span>
                  <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarButton>
                <NavbarButton href='/profile'>
                  <span className='sr-only'>User profile</span>
                  <UserIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarButton>
                <NavbarButton href='#'>
                  <span className='sr-only'>Sign out</span>
                  <ArrowRightStartOnRectangleIcon
                    className='h-6 w-6'
                    aria-hidden='true'
                  />
                </NavbarButton>
              </>
            ) : (
              <>
                <Link
                  href='/auth/signup'
                  className='hidden rounded-full px-3 py-2 text-sm font-medium text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32] sm:block'
                >
                  Create account
                </Link>
                <Link
                  href='/auth/signin'
                  className='rounded-full bg-[#a14d32] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#873d27]'
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}