import * as B from 'fp-ts/boolean'
import { concatAll } from 'fp-ts/lib/Monoid'
import { contramap, getMonoid } from 'fp-ts/lib/Ord'
import * as N from 'fp-ts/number'
import { typedFromEntries } from '../util'
import { BasicPieceKind, BasicPieceKindIndices, PieceKind } from './pieceKind'

export const Players = ['先手', '後手'] as const
export type Player = typeof Players[number]
export const PlayerIndices = typedFromEntries(Players.map((player, i) => [player, i]))

export function invertPlayer(player: Player): Player {
  return player === '先手' ? '後手' : '先手'
}

export interface BoardLocation { player: Player, stand: false, row: number, column: number }
export type PieceLocation = BoardLocation | { player: Player, stand: true }
export interface DetailedStandLocation { player: Player, stand: true, basicPieceKind: BasicPieceKind }
export type DetailedPieceLocation = BoardLocation | DetailedStandLocation

export function isValidBoardLocation(location: Pick<BoardLocation, 'row' | 'column'>): boolean {
  return 0 <= location.row && location.row <= 8 && 0 <= location.column && location.column <= 8
}

export type Piece = PieceKind & PieceLocation

export const PieceOrdByKind = concatAll(getMonoid<Piece>())([
  contramap((piece: Piece) => BasicPieceKindIndices[piece.basicPieceKind])(N.Ord),
  contramap((piece: Piece) => PlayerIndices[piece.player])(N.Ord),
  contramap((piece: Piece) => piece.stand)(B.Ord),
  contramap((piece: Piece) => piece.stand ? 0 : piece.row)(N.Ord),
  contramap((piece: Piece) => piece.stand ? 0 : piece.column)(N.Ord),
  contramap((piece: Piece) => piece.isPromoted)(B.Ord),
])

export interface MoveDestination {
  isPromoted: boolean,
  row: number
  column: number
}

export function isValidPromotionChange(from: Piece, to: MoveDestination): boolean {
  return from.isPromoted === to.isPromoted ||
    !from.isPromoted && to.isPromoted && !['金', '玉'].includes(from.basicPieceKind) &&
    !from.stand &&
    (from.player === '先手' ? from.row <= 2 || to.row <= 2 : from.row >= 6 || to.row >= 6)
}
