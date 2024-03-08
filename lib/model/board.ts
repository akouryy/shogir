import { filter, takeLeftWhile } from 'fp-ts/lib/ReadonlyArray'
import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import { isEqual } from 'lodash'
import { typedEntries } from '../util'
import {
  MoveDestination, Piece, Player, Players, invertPlayer, isValidBoardLocation, isValidPromotionChange,
} from './piece'
import { BasicPieceKind, BasicPieceKinds, pointMovePotentials, straightMovePotentials } from './pieceKind'

export class Board {
  static readonly PieceCounts: Record<BasicPieceKind, number> = {
    歩: 18, 香: 4, 桂: 4, 銀: 4, 金: 4, 角: 2, 飛: 2, 玉: 2,
  }

  /** row -> column -> piece */
  readonly pieceByBoardLocation: ReadonlyArray<ReadonlyArray<Piece | undefined>>
  /** player -> basicPieceKind -> pieces */
  readonly piecesByDetailedStandLocation: ReadonlyArray<ReadonlyArray<readonly Piece[]>>

  constructor(public turn: Player, public pieces: readonly Piece[]) {
    this.pieceByBoardLocation = range(0, 8).map((row) => range(0, 8).map((column) =>
      pieces.find((piece) => !piece.stand && piece.row === row && piece.column === column),
    ))
    this.piecesByDetailedStandLocation = range(0, 1).map((playerIndex) => range(0, 6).map((basicPieceKindIndex) =>
      pieces.filter((piece) =>
        piece.stand && piece.player === Players[playerIndex] && piece.basicPieceKind === BasicPieceKinds[basicPieceKindIndex],
      ),
    ))
    console.log(this.pieceByBoardLocation, this.piecesByDetailedStandLocation)
  }

  isValid(): boolean {
    return (
      this.pieces.length === 40 &&
      typedEntries(Board.PieceCounts).every(([kind, count]) => (
        this.pieces.filter((piece) => piece.basicPieceKind === kind).length === count
      ))
    )
  }

  /**
   * @param ignoreMineOrStuck 自分の駒、およびそれ以上動けない地点を無視する。「それ以上動けない地点」自体の判定に用いる際true。
   */
  moveCandidates(selectedPiece: Piece, { ignoreMineOrStuck = false } = {}): MoveDestination[] {
    const playerCoefficient = selectedPiece.player === '先手' ? 1 : -1

    if(selectedPiece.stand) {
      return range(0, 8).flatMap((row) => range(0, 8).map((column) => ({
        isPromoted: false,
        row,
        column,
      } satisfies MoveDestination))).filter(({ row, column }) => (
        isValidBoardLocation({ row, column }) && (
          ignoreMineOrStuck ||
          this.pieceByBoardLocation[row][column]?.player !== selectedPiece.player &&
          this.moveCandidates({ ...selectedPiece, stand: false, row, column }, { ignoreMineOrStuck: true }).length > 0
        )
      ))
    } else {
      return (selectedPiece.isPromoted ? [true] : [false, true]).flatMap((isPromoted) => [
        ...pointMovePotentials(selectedPiece).map(([dr, dc]) => ({
          isPromoted,
          row: selectedPiece.row + dr * playerCoefficient,
          column: selectedPiece.column + dc * playerCoefficient,
        } satisfies MoveDestination)).filter(({ row, column }) => (
          isValidPromotionChange(selectedPiece, { isPromoted, row, column }) &&
          isValidBoardLocation({ row, column }) && (
            ignoreMineOrStuck ||
            this.pieceByBoardLocation[row][column]?.player !== selectedPiece.player &&
            this.moveCandidates({ ...selectedPiece, isPromoted, stand: false, row, column }, { ignoreMineOrStuck: true })
              .length > 0
          )
        )),
        ...straightMovePotentials(selectedPiece).flatMap(([dr, dc]) => pipe(
          range(1, 8).map((i) => ({
            isPromoted,
            row: selectedPiece.row + dr * i * playerCoefficient,
            column: selectedPiece.column + dc * i * playerCoefficient,
          } satisfies MoveDestination)),
          takeLeftWhile(({ row, column }) => (
            0 <= row && row < 9 && 0 <= column && column < 9 && (
              ignoreMineOrStuck ||
              this.pieceByBoardLocation[row][column]?.player !== selectedPiece.player &&
              this.pieceByBoardLocation[row - dr * playerCoefficient][column - dc * playerCoefficient]?.player !==
                invertPlayer(selectedPiece.player) &&
              this.moveCandidates({ ...selectedPiece, isPromoted, stand: false, row, column }, { ignoreMineOrStuck: true })
                .length > 0
            )
          )),
          filter(({ row, column }) => isValidPromotionChange(selectedPiece, { isPromoted, row, column })),
        )),
      ])
    }
  }

  movePiece(from: Piece, to: MoveDestination): Board {
    /* 駒台の駒を動かす場合、複数の同種の駒の区別がつかないので、object idで判定するために1つ取る */
    const currentFromPiece = this.pieces.find((piece) => isEqual(piece, from))

    const pieces = this.pieces.map<Piece>((piece) =>
      piece === currentFromPiece ?
        { ...to, basicPieceKind: from.basicPieceKind, player: from.player, stand: false } satisfies Piece : // 移動する
        !piece.stand && piece.row === to.row && piece.column === to.column ?
          { basicPieceKind: piece.basicPieceKind, isPromoted: false, player: from.player, stand: true } : // 持ち駒にする
          piece,
    )
    console.log(from, to, this.pieces, pieces)
    return new Board(invertPlayer(this.turn), pieces)
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
