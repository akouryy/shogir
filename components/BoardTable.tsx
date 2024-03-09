import clsx from 'clsx'
import { range } from 'fp-ts/lib/NonEmptyArray'
import React, { useEffect, useMemo, useState } from 'react'
import { Board } from '../lib/model/board'
import { Piece } from '../lib/model/piece'
import { BoardCell } from './BoardCell'
import { BoardTableStand } from './BoardTableStand'

interface P {
  board: Board
  nextPreviewBoard?: Board
}

export type MovingState =
  | { type: 'none', piece?: never }
  | { type: 'moving', piece: Piece }
  // | { type: 'askingPromotion', piece: Piece, destination: { row: number, column: number } }

export const BoardTable: React.FC<P> = ({ board, nextPreviewBoard }) => {
  const [movingState, setMovingState] = useState<MovingState>({ type: 'none' })

  const moveCandidates = useMemo(() => {
    if(movingState.type !== 'moving') { return [] }

    return board.moveCandidates(movingState.piece)
  }, [board, movingState])

  useEffect(function resetSelectedPieceOnBoardChange() { setMovingState({ type: 'none' }) }, [board])

  return (
    <div className='text-2xl leading-none'>
      <BoardTableStand
        board={board}
        movingState={movingState}
        nextPreviewBoard={nextPreviewBoard}
        player='後手'
        setMovingState={setMovingState}
      />

      {range(0, 8).map((row) => (
        <div
          className={clsx(
            'flex',
            row === 0 && 'border-t-4',
            row === 8 && 'border-b-4',
            board.turn === '先手' && row === 8 ? 'border-b-neutral-300' : 'border-b-transparent',
            board.turn === '後手' && row === 0 ? 'border-t-neutral-300' : 'border-t-transparent',
          )}
          key={row}
        >
          {range(0, 8).map((column) => (
            <BoardCell
              board={board}
              key={column}
              location={{ stand: false, row, column }}
              moveCandidates={moveCandidates}
              movingState={movingState}
              nextPreviewBoard={nextPreviewBoard}
              setMovingState={setMovingState}
            />
          ))}
        </div>
      ))}

      <BoardTableStand
        board={board}
        movingState={movingState}
        nextPreviewBoard={nextPreviewBoard}
        player='先手'
        setMovingState={setMovingState}
      />
    </div>
  )
}
