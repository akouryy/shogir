import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import Link from 'next/link'
import React, { useContext } from 'react'
import { BoardTable } from '../components/BoardTable'
import { Rating } from '../components/Rating'
import { ShogirContext } from '../contexts/ShogirContext'
import { IOBoard } from '../lib/model/ioBoard'

const PageIndex: React.FC = () => {
  const { work } = useContext(ShogirContext)
  console.log('work', work)

  return (
    <div className='flex flex-wrap gap-8'>
      {work && Object.entries(work).map(([code, workValue]) => (
        <Link className='card card-bordered card-compact shadow-xl' href={`/board/${code}`} key={code}>
          <figure>
            {pipe(
              IOBoard.decode(code),
              fold(
                () => <div>Invalid code: {code}</div>,
                (board) => <BoardTable board={board} />,
              ),
            )}
          </figure>
          <div className='card-body'>
            <Rating readOnly size='sm' workEntry={[code, workValue]} />
            <p>{workValue.comment}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PageIndex
