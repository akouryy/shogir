import clsx from 'clsx'
import { sortBy } from 'fp-ts/lib/ReadonlyArray'
import { pipe } from 'fp-ts/lib/function'
import Link from 'next/link'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'
import { useDebouncedMemo } from '../hooks/useDebouncedMemo'
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

type RegisteredMoveWithTimeline = RegisteredMove & { timeline: ReturnType<typeof bestMoveTimeline> }

export const BoardDetails: React.FC<P> = ({ board }) => {
  const { setWork, work } = useContext(ShogirContext)

  const [nextPreviewBoard, setNextPreviewBoard] = useState<Board>()

  const code = useMemo(() => IOBoard.encode(board), [board])

  const debouncedWork = useDebouncedMemo(() => work, [work], 2500)
  const currentRegisteredMoves: readonly RegisteredMoveWithTimeline[] = useMemo(() => (
    sortBy(registeredMoveOrd(debouncedWork))(registeredMoves(board, debouncedWork)).map((move) => ({
      ...move,
      timeline: debouncedWork ? bestMoveTimeline(10, debouncedWork, board.movePiece(move.piece, move.destination)) : [],
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [board, debouncedWork, work !== undefined])

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
          {work && currentRegisteredMoves.map(({ piece, destination, newCode, timeline }) => pipe(
            [newCode, ...timeline.map((timelineItem) => timelineItem.newCode)]
              .map((c) => work?.[c]?.comment)
              .findIndex((c) => c),
            (commentIndex) => (
              <li className='' key={shortMoveText(piece, destination)}>
                <Link
                  className={clsx('link-primary mr-4', commentIndex === 0 ? 'link' : 'link-hover')}
                  href={`/board/${newCode}`}
                  // eslint-disable-next-line react/jsx-no-bind
                  onMouseEnter={() => setNextPreviewBoard(board.movePiece(piece, destination))}
                  // eslint-disable-next-line react/jsx-no-bind
                  onMouseLeave={() => setNextPreviewBoard(undefined)}
                >
                  {shortMoveText(piece, destination)}
                </Link>
                {work && (<Rating readOnly size='sm' workEntry={[newCode, work[newCode]]} />)}
                {timeline.map((timelineItem, i) => (
                  <Link
                    className={clsx('ml-4', commentIndex === i + 1 ? 'link' : 'link-hover')}
                    href={`/board/${timelineItem.newCode}`}
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    // eslint-disable-next-line react/jsx-no-bind
                    onMouseEnter={() => setNextPreviewBoard(timelineItem.board)}
                    // eslint-disable-next-line react/jsx-no-bind
                    onMouseLeave={() => setNextPreviewBoard(undefined)}
                  >
                    {shortMoveText(timelineItem.piece, timelineItem.destination)}
                    {timelineItem.hasSiblings && '*'}
                  </Link>
                ))}
                <p>
                  {commentIndex >= 0 && (
                    work?.[[newCode, ...timeline.map((timelineItem) => timelineItem.newCode)][commentIndex]]?.comment
                  )}
                </p>
              </li>
            )))}
        </ul>
      </div>
    </div>
  )
}
