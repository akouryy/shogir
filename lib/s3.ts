import { CognitoIdentityCredentials, S3 } from 'aws-sdk'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { IOWork, InitialWork, Work } from './model/work'

const BUCKET_NAME = process.env.NEXT_PUBLIC_WORKSPACE_S3_BUCKET_NAME

function workKey(credentials: CognitoIdentityCredentials): string {
  return `${credentials.identityId}/work.yml`
}

export async function saveWork(credentials: CognitoIdentityCredentials, work: Work): Promise<void> {
  return await new Promise((resolve, reject) => {
    const s3 = new S3()

    s3.putObject({
      Bucket: BUCKET_NAME,
      Key: workKey(credentials),
      Body: JSON.stringify(IOWork.encode(work)),
      ContentType: 'text/plain',
    }, (err, _) => {
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
          saveWork(credentials, InitialWork).then(() => resolve(InitialWork)).catch(reject)
        } else {
          reject(err)
        }
      } else {
        const body = data.Body?.toString()
        if(body === undefined) {
          reject(new Error('no body'))
        } else {
          pipe(
            IOWork.decode(JSON.parse(body)),
            fold(
              (errors) => reject(new Error(JSON.stringify(errors))),
              resolve,
            ),
          )
        }
      }
    })
  })
}
