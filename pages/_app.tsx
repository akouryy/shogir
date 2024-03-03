import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import 'modern-normalize'
import '../styles/all.sass'
import { ShogirContext } from '../contexts/ShogirContext'

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  const [cognitoIdToken, setCognitoIdToken] = useState<AmazonCognitoIdentity.CognitoIdToken>()
  const [cognitoUserPool, setCognitoUserPool] = useState<AmazonCognitoIdentity.CognitoUserPool>()

  useEffect(() => {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      ClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
    })
    setCognitoUserPool(userPool)

    if(/^\/(_|login)/.test(router.pathname)) { return }

    const cognitoUser = userPool.getCurrentUser()
    if(!cognitoUser) {
      // void router.push('/login')
      void router.push({ pathname: '/login', query: { redirect: router.pathname } })
      return
    }

    cognitoUser.getSession((err: Error | null, session: AmazonCognitoIdentity.CognitoUserSession | null) => {
      if(err || !session) {
        console.error(err)
        void router.push('/login')
        return
      }

      setCognitoIdToken(session.getIdToken())
    })
  }, [router, router.pathname])

  return (
    <ShogirContext.Provider value={{ cognitoIdToken, cognitoUserPool, setCognitoIdToken }}>
      <Component {...pageProps} />
    </ShogirContext.Provider>
  )
}
