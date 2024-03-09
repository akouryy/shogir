import { CognitoIdToken, CognitoUserPool } from 'amazon-cognito-identity-js'
import { createContext } from 'react'
import { Work } from '../lib/model/work'

export const ShogirContext = createContext<{
  cognitoIdToken?: CognitoIdToken,
  cognitoUserPool?: CognitoUserPool,
  setCognitoIdToken?: (token: CognitoIdToken) => void,
  setWork?: React.Dispatch<React.SetStateAction<Work | undefined>>,
  work?: Work,
}>({})
