import { typedFromEntries } from '../util'

export const BasicPieceKinds = ['歩', '香', '桂', '銀', '金', '角', '飛', '玉'] as const
export type BasicPieceKind = typeof BasicPieceKinds[number]
export const BasicPieceKindIndices = typedFromEntries(BasicPieceKinds.map((kind, i) => [kind, i]))

export interface PieceKind {
  basicPieceKind: BasicPieceKind
  isPromoted: boolean
}

export function ShortPieceKindText(pieceKind: PieceKind): string {
  if(pieceKind.isPromoted) {
    return {
      歩: 'と', 香: '杏', 桂: '圭', 銀: '全', 金: '❌', 角: '馬', 飛: '龍', 玉: '❌',
    }[pieceKind.basicPieceKind]
  } else {
    return pieceKind.basicPieceKind
  }
}

export function LongPieceKindText(pieceKind: PieceKind): string {
  if(pieceKind.isPromoted) {
    return {
      歩: 'と', 香: '成香', 桂: '成桂', 銀: '成銀', 金: '❌', 角: '馬', 飛: '龍', 玉: '❌',
    }[pieceKind.basicPieceKind]
  } else {
    return pieceKind.basicPieceKind
  }
}

export function pointMovePotentials(pieceKind: PieceKind): ReadonlyArray<[number, number]> {
  const goldMoves: ReadonlyArray<[number, number]> = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]]

  switch (pieceKind.basicPieceKind) {
  case '歩': return pieceKind.isPromoted ? goldMoves : [[-1, 0]]
  case '香': return pieceKind.isPromoted ? goldMoves : []
  case '桂': return pieceKind.isPromoted ? goldMoves : [[-2, -1], [-2, 1]]
  case '銀': return pieceKind.isPromoted ? goldMoves : [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 1]]
  case '金': return goldMoves
  case '角': return pieceKind.isPromoted ? [[-1, 0], [0, -1], [0, 1], [1, 0]] : []
  case '飛': return pieceKind.isPromoted ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : []
  case '玉': return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  default: throw new Error()
  }
}

export function straightMovePotentials(pieceKind: PieceKind): ReadonlyArray<[number, number]> {
  switch (pieceKind.basicPieceKind) {
  case '香': return pieceKind.isPromoted ? [] : [[-1, 0]]
  case '角': return [[-1, -1], [-1, 1], [1, -1], [1, 1]]
  case '飛': return [[-1, 0], [0, -1], [0, 1], [1, 0]]
  default: return []
  }
}
