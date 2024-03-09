import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { useRouter } from 'next/router'
import React from 'react'
import { BoardDetails } from '../../components/BoardDetails'
import { IOBoard } from '../../lib/model/ioBoard'

const PageBoardCode: React.FC = () => {
  const router = useRouter()
  const { code } = router.query as { code: string }

  const maybeBoard = IOBoard.decode(code)

  return (
    <>
      {pipe(
        maybeBoard,
        fold(
          (errors) => <div className='alert alert-error'>{errors.toString()}</div>,
          (board) => <BoardDetails board={board} />,
        ),
      )}
    </>
  )
}

export default PageBoardCode
