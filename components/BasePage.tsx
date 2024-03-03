import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

interface P {
  children: React.ReactNode
  title?: string
}

export const BasePage: React.FC<P> = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title !== undefined ? `${title} - shogir` : 'shogir'}</title>
      </Head>

      <header className='navbar bg-neutral min-h-8 text-neutral-content'>
        <Link className='text-3xl' href='/'>shogir</Link>
      </header>

      <main className='flex flex-col items-center justify-center p-4'>
        {children}
      </main>
    </div>
  )
}
