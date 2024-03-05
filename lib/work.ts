import { CognitoIdentityCredentials, S3 } from 'aws-sdk'

export type Work = string

const BUCKET_NAME = process.env.NEXT_PUBLIC_WORKSPACE_S3_BUCKET_NAME!

function workKey(credentials: CognitoIdentityCredentials): string {
  return `${credentials.identityId}/work.yml`
}

export async function saveWork(credentials: CognitoIdentityCredentials, work: Work): Promise<void> {
  return await new Promise((resolve, reject) => {
    const s3 = new S3()

    s3.putObject({ Bucket: BUCKET_NAME, Key: workKey(credentials), Body: work, ContentType: 'text/plain' }, (err, _) => {
      if(err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function loadWork(credentials: CognitoIdentityCredentials): Promise<Work> {
  return await new Promise((resolve, reject) => {
    new S3().getObject({ Bucket: BUCKET_NAME, Key: workKey(credentials) }, (err, data) => {
      if(err) {
        if(err.code === 'NoSuchKey') {
          // eslint-disable-next-line promise/no-promise-in-callback
          saveWork(credentials, '').then(() => resolve('')).catch(reject)
        } else {
          reject(err)
        }
      } else {
        const work = data.Body?.toString()
        if(work === undefined) {
          reject(new Error('no body'))
        } else {
          resolve(work)
        }
      }
    })
  })
}
