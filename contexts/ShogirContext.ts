import { CognitoIdToken, CognitoUserPool } from 'amazon-cognito-identity-js'
import { createContext } from 'react'

export const ShogirContext = createContext<{
  cognitoIdToken?: CognitoIdToken,
  cognitoUserPool?: CognitoUserPool,
  setCognitoIdToken?: (token: CognitoIdToken) => void,
}>({})