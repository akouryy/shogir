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
