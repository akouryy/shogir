import { pipe } from 'fp-ts/lib/function'
import Link from 'next/link'
import React, { useContext } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'
import { IOBoard } from '../lib/model/ioBoard'

const PageIndex: React.FC = () => {
  const { work } = useContext(ShogirContext)
  console.log('work', work)

  return (
    <>
      {work?.map(([board]) => pipe(
        IOBoard.encode(board),
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
