import * as B from 'fp-ts/boolean'
import { concatAll } from 'fp-ts/lib/Monoid'
import { contramap, getMonoid } from 'fp-ts/lib/Ord'
import * as N from 'fp-ts/number'
import { typedFromEntries } from '../util'
import { BasicPieceKindIndices, PieceKind } from './pieceKind'

export const Players = ['先手', '後手'] as const
export type Player = typeof Players[number]
export const PlayerIndices = typedFromEntries(Players.map((player, i) => [player, i]))

export type Location = { player: Player, stand: false, row: number, column: number } | { player: Player, stand: true }

export type Piece = PieceKind & Location

export const PieceOrdByKind = concatAll(getMonoid<Piece>())([
  contramap((piece: Piece) => BasicPieceKindIndices[piece.basicPieceKind])(N.Ord),
  contramap((piece: Piece) => PlayerIndices[piece.player])(N.Ord),
  contramap((piece: Piece) => piece.stand)(B.Ord),
  contramap((piece: Piece) => piece.stand ? 0 : piece.row)(N.Ord),
  contramap((piece: Piece) => piece.stand ? 0 : piece.column)(N.Ord),
  contramap((piece: Piece) => piece.isPromoted)(B.Ord),
])
