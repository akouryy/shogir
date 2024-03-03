import React, { useContext } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const { cognitoIdToken } = useContext(ShogirContext)

  return (
    <code className='break-all'>
      {cognitoIdToken?.getJwtToken()}
    </code>
  )
}

export default PageIndex
