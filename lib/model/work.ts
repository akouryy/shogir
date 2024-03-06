import * as t from 'io-ts'
import { InitialBoard } from './board'
import { IOBoard } from './ioBoard'

export const IOWork = t.array(
  t.tuple([IOBoard, t.intersection([
    t.type({
      moves: t.array(t.string),
    }),
    t.partial({
      comment: t.string,
      bookmarkKey: t.string,
    }),
  ])]),
)

export type Work = t.TypeOf<typeof IOWork>

export const InitialWork: Work = [
  [InitialBoard, { moves: [] }],
]
