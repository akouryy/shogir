import clsx from 'clsx'
import React, { useMemo } from 'react'
import { Board } from '../lib/model/board'
import { Player, PlayerIndices } from '../lib/model/piece'
import { BasicPieceKind, BasicPieceKindIndices, BasicPieceKinds, ShortPieceKindText } from '../lib/model/pieceKind'
import { MovingState } from './BoardTable'

interface P {
  board: Board
  movingState: MovingState
  player: Player
  setMovingState: React.Dispatch<React.SetStateAction<MovingState>>
}

export const BoardTableStand: React.FC<P> = ({ board, movingState, player, setMovingState }) => {
  const standPieceCounts = useMemo<Array<[BasicPieceKind, number]>>(() => (
    BasicPieceKinds.slice(0, -1).map((kind) => (
      [kind, board.piecesByDetailedStandLocation[PlayerIndices[player]][BasicPieceKindIndices[kind]].length]
    ))
  ), [board, player])

  return (
    <div className={clsx('my-2 flex justify-end', player === '先手' ? 'mt-2' : 'mb-2 flex-row-reverse')}>
      {standPieceCounts.map(([kind, pieceCount]) => pieceCount > 0 && (
        <div
          className={clsx(
            'aspect-square size-8',
            movingState.piece?.stand && movingState.piece.basicPieceKind === kind ? 'bg-primary/20' : 'hover:bg-primary/10',
          )}
          key={kind}
        >
          <button
            className={clsx('relative size-full text-center align-middle text-xl', player === '後手' && 'rotate-180')}
            onClick={() => {
              if(movingState.piece?.stand && movingState.piece.basicPieceKind === kind) {
                setMovingState({ type: 'none' })
              } else if(pieceCount > 0 && board.turn === player) {
                setMovingState({ type: 'moving', piece: { basicPieceKind: kind, isPromoted: false, player, stand: true } })
              } else {
                setMovingState({ type: 'none' })
              }
            }}
          >
            {ShortPieceKindText({ basicPieceKind: kind, isPromoted: false })}
            {pieceCount >= 2 && (
              <div className='absolute -right-1 bottom-0 text-base font-bold text-primary'>
                {pieceCount}
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
