import { pipe } from 'fp-ts/lib/function'
import Link from 'next/link'
import React, { useContext } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const { work } = useContext(ShogirContext)
  console.log('work', work)

  return (
    <>
      {work && Object.entries(work).map(([code]) => pipe(
        code,
        code => (
          <Link
            className='link link-primary block'
            href={`/board/${code}`}
            key={code}
          >
            {code}
          </Link>
        ),
      ))}
    </>
  )
}

export default PageIndex
