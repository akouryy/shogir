import { CognitoIdToken, CognitoUserPool } from 'amazon-cognito-identity-js'
import { createContext } from 'react'
import { Work } from '../lib/model/work'

export const ShogirContext = createContext<{
  cognitoIdToken?: CognitoIdToken,
  cognitoUserPool?: CognitoUserPool,
  work?: Work,
  setCognitoIdToken?: (token: CognitoIdToken) => void,
}>({})
