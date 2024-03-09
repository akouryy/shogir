import { pipe } from 'fp-ts/lib/function'
import Link from 'next/link'
import React, { useCallback, useContext, useMemo } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'
import { Board } from '../lib/model/board'
import { IOBoard, InitialBoardCode } from '../lib/model/ioBoard'
import { shortMoveText } from '../lib/model/piece'
import { nonNaN } from '../lib/util'
import { BoardTable } from './BoardTable'
import { Rating } from './Rating'

interface P {
  board: Board;
}

export const BoardDetails: React.FC<P> = ({ board }) => {
  const { setWork, work } = useContext(ShogirContext)

  const code = useMemo(() => IOBoard.encode(board), [board])

  const updateComment = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setWork?.((work) =>
      work && { ...work, [code]: { ...work[code], comment: ev.target.value } },
    )
  }

  const updateRating = useCallback((ev: React.ChangeEvent<HTMLInputElement>): void => {
    setWork?.((work) =>
      work && { ...work, [code]: { ...work[code], rating: nonNaN(Number(ev.target.value)) / 2 } },
    )
  }, [code, setWork])

  const registerWork = (): void => {
    setWork?.((work) => ({ ...work, [code]: { comment: '', rating: 0 } }))
  }

  const deregisterWork = (): void => {
    setWork?.((work) => {
      const { [code]: _, ...rest } = { ...work }
      return rest
    })
  }

  const registeredMoves = useMemo(() => {
    if(!work) { return [] }

    return board.pieces
      .flatMap((piece) => (
        board.moveCandidates(piece)
          .map((destination) => ({ piece, destination, newCode: IOBoard.encode(board.movePiece(piece, destination)) }))
      ))
      .filter(({ newCode }) => work[newCode])
  }, [board, work])

  return (
    <div className='flex size-full'>
      <div className='flex flex-col'>
        <BoardTable board={board} />
        {work ? work?.[code] ? pipe(work[code], (currentWork) => (
          <>
            <Rating currentWork={currentWork} updateRating={updateRating} />
            <textarea
              className='textarea textarea-bordered textarea-primary flex-1 text-base'
              onChange={updateComment}
              value={currentWork.comment}
            />
            {currentWork.comment === '' && code !== InitialBoardCode && (
              <button className='btn btn-outline btn-error mt-4' onClick={deregisterWork}>
                この盤面を削除
              </button>
            )}
          </>
        )) : (
          <button className='btn btn-outline btn-primary' onClick={registerWork}>
            この盤面を追加
          </button>
        ) : (
          <div className='loading loading-spinner m-auto' />
        )}
      </div>
      <div className='divider divider-horizontal' />
      <div>
        <ul className='list-disc'>
          {registeredMoves.map(({ piece, destination, newCode }) => (
            <li className='' key={shortMoveText(piece, destination)}>
              <Link className='link link-primary' href={`/board/${newCode}`}>
                {shortMoveText(piece, destination)}
              </Link>
              <span className='ml-4'>
                {work?.[newCode]?.comment}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
