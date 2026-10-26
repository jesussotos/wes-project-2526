import { ReactNode } from 'react'
import Link from 'next/link'

export const navbarButtonClasses =
  'rounded-full p-2 text-[#6d584a] transition-colors hover:bg-[#f2e7d8] hover:text-[#a14d32] focus:text-[#a14d32] focus:outline-none focus:ring-2 focus:ring-[#a14d32]';

interface NavbarButtonProps {
  href: string;
  children: ReactNode;
}

export default function NavbarButton({ href, children }: NavbarButtonProps) {
  return (
    <Link href={href} className={navbarButtonClasses}>
      {children}
    </Link>
  )
}