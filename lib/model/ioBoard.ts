import { chunksOf, replicate, sortBy } from 'fp-ts/lib/ReadonlyArray'
import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import * as t from 'io-ts'
import { typedEntries } from '../util'
import { Board, InitialBoard } from './board'
import { Piece, PieceOrdByKind, PlayerIndices, Players } from './piece'

const BTOA = [
  ...range('0'.charCodeAt(0), '9'.charCodeAt(0)),
  ...range('A'.charCodeAt(0), 'Z'.charCodeAt(0)),
  ...range('a'.charCodeAt(0), 'z'.charCodeAt(0)),
].map((i) => String.fromCharCode(i))

const ATOB = Object.fromEntries(BTOA.map((c, i) => [c, i]))

const BasicPieceKindsByIndex =
  typedEntries(Board.PieceCounts).flatMap(([basicPieceKind, count]) => replicate(count, basicPieceKind))

function encodePieceWithoutBasicPieceKind(piece: Piece): string {
  const first = PlayerIndices[piece.player] * 10 + (piece.stand ? 9 : piece.row)
  const second = (piece.stand ? 0 : piece.column) * 2 + (piece.isPromoted ? 1 : 0)

  console.log(first, second, BTOA[first], BTOA[second])

  return BTOA[first] + BTOA[second]
}

export function encode(board: Board): string {
  const pieces = sortBy([PieceOrdByKind])(board.pieces)
  return [...pieces.map(encodePieceWithoutBasicPieceKind), BTOA[PlayerIndices[board.turn]]].join('')
}

function decodePiece([first, second]: readonly number[], codeIndex: number): Piece {
  const stand = (first % 10) === 9

  return {
    basicPieceKind: BasicPieceKindsByIndex[codeIndex],
    isPromoted: second % 2 === 1,
    player: Players[Math.floor(first / 10)],
    ...(stand ? {
      stand,
    } : {
      stand,
      row: first % 10,
      column: Math.floor(second / 2),
    }),
  }
}

export function decode(rawCode: string): Board {
  const codes = chunksOf(2)([...rawCode].map((c) => ATOB[c]))

  const pieces = codes.slice(0, -1).map<Piece>(decodePiece)
  const turn = Players[codes[codes.length - 1][0]]

  return new Board(turn, pieces)
}

export const IOBoard = new t.Type<Board, string, unknown>(
  'ioBoard',
  (u): u is Board => u instanceof Board,
  (u, c) => {
    if(typeof u !== 'string') {
      return t.failure(u, c)
    }
    const board = decode(u)
    return board.isValid() ? t.success(board) : t.failure(u, c)
  },
  encode,
)

export const InitialBoardCode = IOBoard.encode(InitialBoard)
