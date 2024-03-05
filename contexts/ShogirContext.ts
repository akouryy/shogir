import { CognitoIdToken, CognitoUserPool } from 'amazon-cognito-identity-js'
import { createContext } from 'react'

export const ShogirContext = createContext<{
  cognitoIdToken?: CognitoIdToken,
  cognitoUserPool?: CognitoUserPool,
  work?: string,
  setCognitoIdToken?: (token: CognitoIdToken) => void,
}>({})
