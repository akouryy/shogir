import clsx from 'clsx'
import { range } from 'fp-ts/lib/NonEmptyArray'
import React from 'react'
import { Board } from '../lib/model/board'
import { ShortPieceKindText } from '../lib/model/pieceKind'

interface P {
  board: Board
}

export const BoardTable: React.FC<P> = ({ board }) => {
  return (
    <div className='grid grid-cols-9 grid-rows-9 gap-px'>
      {range(0, 8).map((row) => (
        range(0, 8).map((column) => {
          const piece = board.pieces.find((piece) => !piece.stand && piece.row === row && piece.column === column)

          return (
            <div className={'aspect-square size-6 shadow'} key={`${row}-${column}`}>
              {piece && (
                <div className={clsx('text-center', piece.player === '後手' && 'rotate-180')}>
                  {ShortPieceKindText(piece)}
                </div>
              )}
            </div>
          )
        },
        )
      ))}
    </div>
  )
}
