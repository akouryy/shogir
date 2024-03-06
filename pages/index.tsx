import React, { useContext } from 'react'
import { BoardTable } from '../components/BoardTable'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const { work } = useContext(ShogirContext)

  return (
    <>
      {work?.[0] && (
        <BoardTable board={work[0][0]} />
      )}

      <code className='break-all'>
        {JSON.stringify(work)}
      </code>
    </>
  )
}

export default PageIndex
