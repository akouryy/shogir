import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import React from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const ratingVariants = tv({
  base: 'rating rating-half -ml-2 align-text-bottom',
  variants: {
    size: {
      sm: 'rating-sm',
      md: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const ratingStarVariants = tv({
  base: 'mask mask-star-2 bg-secondary',
  variants: {
    odd: {
      true: 'mask-half-1',
      false: 'mask-half-2',
    },
    readOnly: {
      true: 'cursor-default',
    },
  },
})

type P = VariantProps<typeof ratingVariants> & {
  workEntry: [string, { comment: string; rating: number }]
} & (
  | {
    readOnly: true
    updateRating?: never
  }
  | {
    readOnly?: false
    updateRating: (ev: React.ChangeEvent<HTMLInputElement>) => void
  }
)

export const Rating: React.FC<P> = ({ readOnly, size, updateRating, workEntry: [code, workValue] }) => {
  return (
    <div className={ratingVariants({ size })}>
      <input
        checked={Math.floor(workValue.rating * 2) === 0}
        className='rating-hidden'
        name={`${code}[rating]`}
        onChange={updateRating}
        readOnly={readOnly}
        type='radio'
        value={0}
      />
      {range(1, 10).map((value) => (
        <input
          checked={Math.floor(workValue.rating * 2) === value}
          className={ratingStarVariants({ odd: value % 2 === 1, readOnly })}
          key={value}
          name={`${code}[rating]`}
          onChange={updateRating}
          readOnly={readOnly}
          type='radio'
          value={value}
        />
      ))}
    </div>
  )
}
