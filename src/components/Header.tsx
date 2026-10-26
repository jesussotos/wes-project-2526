export default function Header() {
  return (
    <header className='mx-auto w-full border-b border-[#e8d9c5] bg-[#f7efe3] px-6 pb-12 pt-28 text-center sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20'>
      <div className='mx-auto max-w-3xl'>
        <p className='mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#a14d32]'>
          Independent bookstore
        </p>
        <h1 className='font-serif text-4xl font-bold tracking-tight text-[#3d3028] sm:text-5xl lg:text-6xl'>
          Stories for every moment
        </h1>
        <p className='mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6d584a] sm:text-base lg:text-lg'>
          Discover books that spark ideas, accompany your days, and stay with
          you long after the last page.
        </p>
      </div>
    </header>
  )
}