import React, { useContext } from 'react'
import { BasePage } from '../components/BasePage'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const { cognitoIdToken } = useContext(ShogirContext)

  return (
    <BasePage>
      <code className='break-all'>
        {cognitoIdToken?.getJwtToken()}
      </code>
    </BasePage>
  )
}

export default PageIndex
