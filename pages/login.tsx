import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { BasePage } from '../components/BasePage'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const router = useRouter()

  const { cognitoUserPool, setCognitoIdToken } = useContext(ShogirContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    if(!cognitoUserPool || !setCognitoIdToken) { return }

    const authenticationData = {
      Username: name,
      Password: password,
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)
    const userData = {
      Username: name,
      Pool: cognitoUserPool,
    }
    const cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        setCognitoIdToken(result.getIdToken())

        const redirect = Array.isArray(router.query.redirect) ? router.query.redirect[0] : router.query.redirect
        void router.push(redirect?.startsWith('/') ? redirect : '/') // 外部サイトへのリダイレクトを防ぐ
      },
      onFailure: (err) => {
        console.error(err)
      },
    })
  }

  return (
    <BasePage>
      {cognitoUserPool && setCognitoIdToken ? (
        <div>
          <form onSubmit={handleSubmit}>
            <p>
              <label>
                アカウント名 <input onChange={(e) => setName(e.target.value)} type='text' value={name} />
              </label>
            </p>
            <p>
              <label>
                パスワード <input onChange={(e) => setPassword(e.target.value)} type='password' value={password} />
              </label>
            </p>
            <button type='submit'>ログイン</button>
          </form>
        </div>
      ) : (
        <div>
          <p>loading...</p>
        </div>
      )}
    </BasePage>
  )
}

export default PageIndex
