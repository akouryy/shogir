import clsx from 'clsx'
import React, { useMemo } from 'react'
import { Board } from '../lib/model/board'
import { Player, PlayerIndices } from '../lib/model/piece'
import { BasicPieceKind, BasicPieceKindIndices, BasicPieceKinds } from '../lib/model/pieceKind'
import { BoardCell } from './BoardCell'
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
    <div className={clsx('mx-2 flex h-8 justify-end text-xl', player === '後手' && 'flex-row-reverse')}>
      {standPieceCounts.map(([kind, pieceCount]) => pieceCount > 0 && (
        <BoardCell
          board={board}
          key={kind}
          location={{ stand: true, player, basicPieceKind: kind }}
          moveCandidates={[]}
          movingState={movingState}
          setMovingState={setMovingState}
        />
      ))}
    </div>
  )
}
