import clsx from 'clsx'
import { range } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { Board } from '../lib/model/board'
import { IOBoard } from '../lib/model/ioBoard'
import { Piece } from '../lib/model/piece'
import { ShortPieceKindText } from '../lib/model/pieceKind'
import { BoardTableStand } from './BoardTableStand'

interface P {
  board: Board
}

export type MovingState =
  | { type: 'none', piece?: never }
  | { type: 'moving', piece: Piece }
  // | { type: 'askingPromotion', piece: Piece, destination: { row: number, column: number } }

export const BoardTable: React.FC<P> = ({ board }) => {
  const router = useRouter()

  const [movingState, setMovingState] = useState<MovingState>({ type: 'none' })

  const moveCandidates = useMemo(() => {
    if(movingState.type !== 'moving') { return [] }

    return board.moveCandidates(movingState.piece)
  }, [board, movingState])

  useEffect(function resetSelectedPieceOnBoardChange() { setMovingState({ type: 'none' }) }, [board])

  return (
    <div className='text-2xl leading-none'>
      <BoardTableStand board={board} movingState={movingState} player='後手' setMovingState={setMovingState} />

      {range(0, 8).map((row) => (
        <div className='flex' key={row}>
          {range(0, 8).map((column) => pipe(
            board.pieceByBoardLocation[row][column],
            piece => (
              <div
                className={clsx(
                  'aspect-square size-8 shadow',
                  movingState.piece?.stand === false && movingState.piece.row === row && movingState.piece.column === column ?
                    'bg-primary/20' :
                    moveCandidates.some((location) => location.row === row && location.column === column) ?
                      'bg-secondary/20' :
                      'hover:bg-primary/10',
                )}
                key={column}
              >
                <button
                  className={clsx('size-full text-center align-middle', piece?.player === '後手' && 'rotate-180')}
                  onClick={() => {
                    if(movingState.piece?.stand === false && movingState.piece.row === row && movingState.piece.column === column) {
                      setMovingState({ type: 'none' })
                    } else if(piece?.player === board.turn) {
                      setMovingState({ type: 'moving', piece })
                    } else if(movingState.piece) {
                      const destinations = moveCandidates.filter((location) => location.row === row && location.column === column)

                      if(destinations.length > 0) {
                        const isPromoted = destinations.length === 1 ? destinations[0].isPromoted : window.confirm('成りますか？')
                        void router.push(`/board/${
                          IOBoard.encode(board.movePiece(movingState.piece, { isPromoted, row, column }))
                        }`)
                      } else {
                        setMovingState({ type: 'none' })
                      }
                    } else {
                      setMovingState({ type: 'none' })
                    }
                  }}
                >
                  {piece && ShortPieceKindText(piece)}
                </button>
              </div>
            ),
          ))}
        </div>
      ))}

      <BoardTableStand board={board} movingState={movingState} player='先手' setMovingState={setMovingState} />
    </div>
  )
}
