import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'

const PageIndex: React.FC = () => {
  const router = useRouter()

  const { cognitoUserPool, setCognitoIdToken } = useContext(ShogirContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const submittable = !loading && cognitoUserPool && setCognitoIdToken

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    if(!submittable) { return }

    setLoading(true)

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
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        setError(err instanceof Error ? err.message : `${err}`)
        setLoading(false)
      },
    })
  }

  return (
    <form className='max-w-md w-full flex flex-col gap-4 items-stretch' onSubmit={handleSubmit}>
      {error && (<div className='alert alert-error' role='alert'>{error}</div>)}

      <label className='input input-bordered has-[:invalid]:input-error flex items-center gap-2'>
        <span className='i-heroicons-envelope-solid h-4 w-4 opacity-70' />
        <input className='grow' onChange={(e) => setName(e.target.value)} required type='email' value={name} />
      </label>
      <label className='input input-bordered flex items-center gap-2'>
        <span className='i-heroicons-key-solid h-4 w-4 opacity-70' />
        <input className='grow' onChange={(e) => setPassword(e.target.value)} required type='password' value={password} />
      </label>
      <button className='btn btn-primary' disabled={!submittable} type='submit'>
        {submittable ? 'ログイン' : (
          <span className='loading loading-spinner' />
        )}
      </button>
    </form>
  )
}

export default PageIndex
