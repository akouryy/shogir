import React, { useContext } from 'react'
import { BasePage } from '../components/BasePage'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const { cognitoIdToken } = useContext(ShogirContext)

  return (
    <BasePage>
      Hello, world!
      {cognitoIdToken?.getJwtToken()}
    </BasePage>
  )
}

export default PageIndex
