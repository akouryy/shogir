import { contramap, reverse } from 'fp-ts/lib/Ord'
import { sortBy } from 'fp-ts/lib/ReadonlyArray'
import { pipe } from 'fp-ts/lib/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import Link from 'next/link'
import React, { useCallback, useContext, useMemo } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'
import { Board } from '../lib/model/board'
import { IOBoard, InitialBoardCode } from '../lib/model/ioBoard'
import { MoveDestination, Piece, shortMoveText } from '../lib/model/piece'
import { nonNaN } from '../lib/util'
import { BoardTable } from './BoardTable'
import { Rating } from './Rating'

interface P {
  board: Board;
}

interface RegisteredMove { piece: Piece, destination: MoveDestination, newCode: string }

export const BoardDetails: React.FC<P> = ({ board }) => {
  const { setWork, work } = useContext(ShogirContext)

  const code = useMemo(() => IOBoard.encode(board), [board])

  const registeredMoves: RegisteredMove[] = useMemo(() => {
    if(!work) { return [] }

    return board.pieces
      .flatMap((piece) => (
        board.moveCandidates(piece)
          .map((destination) => ({ piece, destination, newCode: IOBoard.encode(board.movePiece(piece, destination)) }))
      ))
      .filter(({ newCode }) => work[newCode])
  }, [board, work])

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

  const registeredMoveOrd = [
    reverse(contramap((move: RegisteredMove) => work?.[move.newCode]?.rating ?? -1)(N.Ord)),
    contramap((move: RegisteredMove) => move.newCode)(S.Ord),
  ]

  return (
    <div className='flex size-full'>
      <div className='flex flex-col'>
        <BoardTable board={board} />
        {work ? work?.[code] ? pipe(work[code], (currentWork) => (
          <>
            <Rating updateRating={updateRating} workEntry={[code, currentWork]} />
            <textarea
              className='textarea textarea-bordered textarea-primary mt-4 flex-1 text-base'
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
          {sortBy(registeredMoveOrd)(registeredMoves).map(({ piece, destination, newCode }) => work && (
            <li className='' key={shortMoveText(piece, destination)}>
              <Link className='link link-primary mr-4' href={`/board/${newCode}`}>
                {shortMoveText(piece, destination)}
              </Link>
              <Rating readOnly size='sm' workEntry={[newCode, work[newCode]]} />
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
