import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'
import { isEqual } from 'lodash'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import '../styles/all.css'
import { useBeforeUnload, useDebounce } from 'react-use'
import { BasePage } from '../components/BasePage'
import { ShogirContext } from '../contexts/ShogirContext'
import { Work } from '../lib/model/work'
import { loadWork, saveWork } from '../lib/s3'

const PROVIDER_KEY = `cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  const [cognitoIdToken, setCognitoIdToken] = useState<AmazonCognitoIdentity.CognitoIdToken>()
  const [cognitoUserPool, setCognitoUserPool] = useState<AmazonCognitoIdentity.CognitoUserPool>()
  const [work, setWork] = useState<Work>()
  const [savedWork, setSavedWork] = useState<Work>()
  const [isSavingWork, setIsSavingWork] = useState(false)
  const [errorDecodingWork, setErrorDecodingWork] = useState<string>()

  useBeforeUnload(work !== savedWork)

  useEffect(() => {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      ClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
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

      AWS.config.region = process.env.NEXT_PUBLIC_AWS_REGION
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
        Logins: { [PROVIDER_KEY]: session.getIdToken().getJwtToken() },
      })
      AWS.config.credentials = credentials

      credentials.refresh(async (err?: AWS.AWSError | null) => {
        if(err) {
          setErrorDecodingWork(err.message)
          console.error(err)
        } else {
          try {
            const work = await loadWork(credentials)
            setWork(work)
            setSavedWork(work)
          } catch (err) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            setErrorDecodingWork(err instanceof Error ? err.message : `${err}`)
            console.error(err)
          }
        }
      })
    })
  }, [router, router.pathname])

  useDebounce(() => {
    if(work === undefined) { return }
    if(!isEqual(work, savedWork)) { return }
    if(isSavingWork) {
      // アップロードは、次に syncing が false になった際のコールバックに任せる
      return
    }

    void (async () => {
      if(AWS.config.credentials instanceof AWS.CognitoIdentityCredentials) {
        setIsSavingWork(true)
        console.log('saving work', work)
        await saveWork(AWS.config.credentials, work)
        setIsSavingWork(false)
        setSavedWork(work)
      }
    })()
  }, 3000, [work, isSavingWork])

  return (
    <ShogirContext.Provider value={{ cognitoIdToken, cognitoUserPool, setCognitoIdToken, work }}>
      <BasePage errorDecodingWork={errorDecodingWork} hasUnsavedChanges={work !== savedWork} isSavingWork={isSavingWork}>
        <Component {...pageProps} />
      </BasePage>
    </ShogirContext.Provider>
  )
}
