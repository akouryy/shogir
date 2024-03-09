import { sortBy } from 'fp-ts/lib/ReadonlyArray'
import { pipe } from 'fp-ts/lib/function'
import Link from 'next/link'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'
import { Board } from '../lib/model/board'
import { IOBoard, InitialBoardCode } from '../lib/model/ioBoard'
import { shortMoveText } from '../lib/model/piece'
import { RegisteredMove, bestMoveTimeline, registeredMoveOrd, registeredMoves } from '../lib/model/work'
import { nonNaN } from '../lib/util'
import { BoardTable } from './BoardTable'
import { Rating } from './Rating'

interface P {
  board: Board;
}

export const BoardDetails: React.FC<P> = ({ board }) => {
  const { setWork, work } = useContext(ShogirContext)

  const [nextPreviewBoard, setNextPreviewBoard] = useState<Board>()

  const code = useMemo(() => IOBoard.encode(board), [board])

  const moves: RegisteredMove[] = useMemo(() => registeredMoves(board, work), [board, work])

  const updateComment = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setWork?.((prevWork) =>
      prevWork && { ...prevWork, [code]: { ...prevWork[code], comment: ev.target.value } },
    )
  }

  const updateRating = useCallback((ev: React.ChangeEvent<HTMLInputElement>): void => {
    setWork?.((prevWork) =>
      prevWork && { ...prevWork, [code]: { ...prevWork[code], rating: nonNaN(Number(ev.target.value)) / 2 } },
    )
  }, [code, setWork])

  const registerWork = (): void => {
    setWork?.((prevWork) => ({ ...prevWork, [code]: { comment: '', rating: 0 } }))
  }

  const deregisterWork = (): void => {
    setWork?.((prevWork) => {
      const { [code]: _, ...rest } = { ...prevWork }
      return rest
    })
  }

  useEffect(function resetNextPreviewBoardOnBoardChange() { setNextPreviewBoard(undefined) }, [board])

  return (
    <div className='flex size-full'>
      <div className='flex flex-col'>
        <BoardTable board={board} nextPreviewBoard={nextPreviewBoard} />
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
          {sortBy(registeredMoveOrd(work))(moves).map(({ piece, destination, newCode }) => work && (
            <li className='' key={shortMoveText(piece, destination)}>
              <Link
                className='link-primary mr-4'
                href={`/board/${newCode}`}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseEnter={() => setNextPreviewBoard(board.movePiece(piece, destination))}
                // eslint-disable-next-line react/jsx-no-bind
                onMouseLeave={() => setNextPreviewBoard(undefined)}
              >
                {shortMoveText(piece, destination)}
              </Link>
              <Rating readOnly size='sm' workEntry={[newCode, work[newCode]]} />
              {bestMoveTimeline(10, work, board.movePiece(piece, destination)).map((timelineMove, i) => (
                <Link
                  className='ml-4'
                  href={`/board/${timelineMove.newCode}`}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                >
                  {shortMoveText(timelineMove.piece, timelineMove.destination)}
                </Link>
              ))}
              <p>
                {work?.[newCode]?.comment}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
