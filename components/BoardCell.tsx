import clsx from 'clsx'
import { pipe } from 'fp-ts/lib/function'
import { useRouter } from 'next/router'
import React from 'react'
import { Board } from '../lib/model/board'
import { IOBoard } from '../lib/model/ioBoard'
import { DetailedPieceLocation, MoveDestination, PlayerIndices, isSameDetailedPieceLocation } from '../lib/model/piece'
import { BasicPieceKindIndices, shortPieceKindText } from '../lib/model/pieceKind'
import { MovingState } from './BoardTable'

interface P {
  board: Board
  location: DetailedPieceLocation
  moveCandidates: MoveDestination[]
  movingState: MovingState
  setMovingState: React.Dispatch<React.SetStateAction<MovingState>>
}

export const BoardCell: React.FC<P> = ({ board, location, moveCandidates, movingState, setMovingState }) => {
  const router = useRouter()
  const piece = board.pieceAt(location)

  return (
    <div
      className={clsx(
        'aspect-square size-8',
        !location.stand && 'shadow',
        movingState.piece && isSameDetailedPieceLocation(movingState.piece, location) ?
          'bg-primary/20' :
          !location.stand &&
          moveCandidates.some((destination) => destination.row === location.row && destination.column === location.column) ?
            'bg-secondary/20' :
            'hover:bg-primary/10',
      )}
    >
      <button
        className={clsx('relative size-full text-center align-middle', piece?.player === '後手' && 'rotate-180')}
        onClick={() => {
          if(movingState.piece && isSameDetailedPieceLocation(movingState.piece, location)) {
            setMovingState({ type: 'none' })
          } else if(piece?.player === board.turn) {
            setMovingState({ type: 'moving', piece })
          } else if(movingState.piece && !location.stand) {
            const destinations = moveCandidates.filter((destination) => (
              isSameDetailedPieceLocation({ stand: false, ...destination }, location)
            ))

            if(destinations.length > 0) {
              const isPromoted = destinations.length === 1 ? destinations[0].isPromoted : window.confirm('成りますか？')
              void router.push(`/board/${
                IOBoard.encode(board.movePiece(movingState.piece, { isPromoted, row: location.row, column: location.column }))
              }`)
            } else {
              setMovingState({ type: 'none' })
            }
          } else {
            setMovingState({ type: 'none' })
          }
        }}
      >
        {piece && shortPieceKindText(piece)}
        {location.stand && pipe(
          board.piecesByDetailedStandLocation[PlayerIndices[location.player]][BasicPieceKindIndices[location.basicPieceKind]].length,
          (pieceCount) => (
            pieceCount >= 2 && (
              <div className='absolute -right-1 bottom-0 text-base font-bold text-primary'>
                {pieceCount}
              </div>
            )
          ),
        )}
      </button>
    </div>
  )
}
