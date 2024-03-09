import clsx from 'clsx'
import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import React from 'react'

interface P {
  currentWork: { comment: string; rating: number }
  updateRating: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

export const Rating: React.FC<P> = ({ currentWork, updateRating }) => {
  return (
    <div className='rating rating-half mb-4'>
      {range(1, 10).map((value) => (
        <input
          checked={Math.floor(currentWork.rating * 2) === value}
          className={clsx('mask mask-star-2 bg-primary', value % 2 === 1 ? 'mask-half-1' : 'mask-half-2')}
          key={value}
          name='rating'
          onChange={updateRating}
          type='radio'
          value={value}
        />
      ))}
    </div>
  )
}
