import React, { useContext } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const { cognitoIdToken, work } = useContext(ShogirContext)

  return (
    <code className='break-all'>
      {cognitoIdToken?.getJwtToken()}
      {work}
    </code>
  )
}

export default PageIndex
