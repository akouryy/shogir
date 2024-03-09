import * as t from 'io-ts'
import { InitialBoardCode } from './ioBoard'

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
