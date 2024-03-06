import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'

type P = React.PropsWithChildren<{
  errorDecodingWork: string | undefined
  hasUnsavedChanges: boolean
  isSavingWork: boolean
}>

export const BasePage: React.FC<P> = ({ children, errorDecodingWork, hasUnsavedChanges, isSavingWork }) => {
  const router = useRouter()

  const { cognitoUserPool } = useContext(ShogirContext)

  const [signingOut, setSigningOut] = useState(false)

  const signOut = (): void => {
    if(cognitoUserPool) {
      setSigningOut(true)
      cognitoUserPool.getCurrentUser()?.signOut(() => {
        setSigningOut(false)
        void router.push('/login')
      })
    }
  }

  return (
    <div className='flex h-dvh flex-col'>
      <header className='navbar h-10 min-h-10 bg-neutral text-neutral-content'>
        <Link className='flex-1 text-3xl' href='/'>☗shogir</Link>

        {errorDecodingWork && (
          <div className='alert alert-error' role='alert'>
            {errorDecodingWork}
          </div>
        )}

        <div className='flex-none'>
          {cognitoUserPool?.getCurrentUser() && (
            <>
              <div className='btn btn-ghost btn-sm cursor-auto'>
                {isSavingWork ? (
                  <span className='loading loading-spinner' />
                ) : hasUnsavedChanges ? (
                  <span className='i-mdi-cloud-upload size-6' />
                ) : (
                  <span className='i-mdi-cloud-check-variant size-6' />
                )}
              </div>
              <button className='btn btn-ghost btn-sm' onClick={signOut} type='button'>
                {signingOut ? (
                  <span className='loading loading-spinner' />
                ) : (
                  <span className='i-lucide-log-out size-6' />
                )}
              </button>
            </>
          )}
        </div>
      </header>

      <main className='flex flex-1 flex-col items-center justify-center p-4'>
        {children}
      </main>
    </div>
  )
}
