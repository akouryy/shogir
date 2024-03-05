import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { ShogirContext } from '../contexts/ShogirContext'

type P = React.PropsWithChildren<{
  hasUnsavedChanges: boolean
  isSavingWork: boolean
}>

export const BasePage: React.FC<P> = ({ children, hasUnsavedChanges, isSavingWork }) => {
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
    <div className='flex flex-col h-dvh'>
      <header className='navbar bg-neutral min-h-8 text-neutral-content'>
        <Link className='flex-1 text-3xl' href='/'>☗shogir</Link>

        <div className='flex-none'>
          {cognitoUserPool?.getCurrentUser() && (
            <>
              <div className='btn btn-sm btn-ghost cursor-auto'>
                {isSavingWork ? (
                  <span className='loading loading-spinner' />
                ) : hasUnsavedChanges ? (
                  <span className='i-mdi-cloud-upload h-6 w-6' />
                ) : (
                  <span className='i-mdi-cloud-check-variant h-6 w-6' />
                )}
              </div>
              <button className='btn btn-sm btn-ghost' onClick={signOut} type='button'>
                {signingOut ? (
                  <span className='loading loading-spinner' />
                ) : (
                  <span className='i-lucide-log-out h-6 w-6' />
                )}
              </button>
            </>
          )}
        </div>
      </header>

      <main className='flex-1 flex flex-col items-center justify-center p-4'>
        {children}
      </main>
    </div>
  )
}
