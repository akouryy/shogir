import { Ord, contramap, reverse } from 'fp-ts/lib/Ord'
import { sortBy, uniq } from 'fp-ts/lib/ReadonlyArray'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { Board } from './board'
import { IOBoard, InitialBoardCode } from './ioBoard'
import { MoveDestination, Piece } from './piece'

export const IOWork = t.record(
  t.string,
  t.intersection([
    t.type({
      comment: t.string,
      rating: t.number,
    }),
    t.partial({
      bookmarkKey: t.string,
    }),
  ]),
)

export type Work = t.TypeOf<typeof IOWork>

export const InitialWork: Work = {
  [InitialBoardCode]: { comment: '', rating: 0 },
}

export interface RegisteredMove { piece: Piece, destination: MoveDestination, newCode: string }

export function registeredMoves(board: Board, work: Work | undefined): readonly RegisteredMove[] {
  if(!work) { return [] }

  return uniq(contramap((move: RegisteredMove) => move.newCode)(S.Ord))(
    board.pieces
      .flatMap((piece) => (
        board.moveCandidates(piece)
          .map((destination) => ({ piece, destination, newCode: IOBoard.encode(board.movePiece(piece, destination)) }))
      ))
      .filter(({ newCode }) => work[newCode]),
  )
}

export function registeredMoveOrd(work: Work | undefined): Array<Ord<RegisteredMove>> {
  return [
    reverse(contramap((move: RegisteredMove) => work?.[move.newCode]?.rating ?? -1)(N.Ord)),
    contramap((move: RegisteredMove) => move.newCode)(S.Ord),
  ]
}

export function bestMoveTimeline(count: number, work: Work, board: Board): Array<RegisteredMove & { board: Board, hasSiblings: boolean }> {
  const ret = []
  let currentBoard = board

  for(let i = 0; i < count; ++i) {
    const moves = registeredMoves(currentBoard, work)
    if(moves.length === 0) { break }
    const bestMove = sortBy(registeredMoveOrd(work))(moves)[0]
    currentBoard = currentBoard.movePiece(bestMove.piece, bestMove.destination)
    ret.push({ ...bestMove, board: currentBoard, hasSiblings: moves.length >= 2 })
  }

  return ret
}
