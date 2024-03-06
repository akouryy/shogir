import { typedEntries } from '../util'
import { Piece, Player } from './piece'
import { BasicPieceKind } from './pieceKind'

export class Board {
  static readonly PieceCounts: Record<BasicPieceKind, number> = {
    歩: 18, 香: 4, 桂: 4, 銀: 4, 金: 4, 角: 2, 飛: 2, 玉: 2,
  }

  constructor(public turn: Player, public pieces: readonly Piece[]) {}

  isValid(): boolean {
    return (
      this.pieces.length === 40 &&
      typedEntries(Board.PieceCounts).every(([kind, count]) => (
        this.pieces.filter((piece) => piece.basicPieceKind === kind).length === count
      ))
    )
  }
}

export const InitialBoard = new Board('先手', [
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 0 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 1 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 2 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 3 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 4 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 5 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 6 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 7 },
  { basicPieceKind: '歩', isPromoted: false, player: '先手', stand: false, row: 6, column: 8 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 0 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 1 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 2 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 3 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 4 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 5 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 6 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 7 },
  { basicPieceKind: '歩', isPromoted: false, player: '後手', stand: false, row: 2, column: 8 },
  { basicPieceKind: '香', isPromoted: false, player: '先手', stand: false, row: 8, column: 0 },
  { basicPieceKind: '香', isPromoted: false, player: '先手', stand: false, row: 8, column: 8 },
  { basicPieceKind: '香', isPromoted: false, player: '後手', stand: false, row: 0, column: 0 },
  { basicPieceKind: '香', isPromoted: false, player: '後手', stand: false, row: 0, column: 8 },
  { basicPieceKind: '桂', isPromoted: false, player: '先手', stand: false, row: 8, column: 1 },
  { basicPieceKind: '桂', isPromoted: false, player: '先手', stand: false, row: 8, column: 7 },
  { basicPieceKind: '桂', isPromoted: false, player: '後手', stand: false, row: 0, column: 1 },
  { basicPieceKind: '桂', isPromoted: false, player: '後手', stand: false, row: 0, column: 7 },
  { basicPieceKind: '銀', isPromoted: false, player: '先手', stand: false, row: 8, column: 2 },
  { basicPieceKind: '銀', isPromoted: false, player: '先手', stand: false, row: 8, column: 6 },
  { basicPieceKind: '銀', isPromoted: false, player: '後手', stand: false, row: 0, column: 2 },
  { basicPieceKind: '銀', isPromoted: false, player: '後手', stand: false, row: 0, column: 6 },
  { basicPieceKind: '金', isPromoted: false, player: '先手', stand: false, row: 8, column: 3 },
  { basicPieceKind: '金', isPromoted: false, player: '先手', stand: false, row: 8, column: 5 },
  { basicPieceKind: '金', isPromoted: false, player: '後手', stand: false, row: 0, column: 3 },
  { basicPieceKind: '金', isPromoted: false, player: '後手', stand: false, row: 0, column: 5 },
  { basicPieceKind: '角', isPromoted: false, player: '先手', stand: false, row: 7, column: 1 },
  { basicPieceKind: '角', isPromoted: false, player: '後手', stand: false, row: 1, column: 7 },
  { basicPieceKind: '飛', isPromoted: false, player: '先手', stand: false, row: 7, column: 7 },
  { basicPieceKind: '飛', isPromoted: false, player: '後手', stand: false, row: 1, column: 1 },
  { basicPieceKind: '玉', isPromoted: false, player: '先手', stand: false, row: 8, column: 4 },
  { basicPieceKind: '玉', isPromoted: false, player: '後手', stand: false, row: 0, column: 4 },
])
