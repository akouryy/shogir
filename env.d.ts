declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NEXT_PUBLIC_AWS_REGION: string
        readonly NEXT_PUBLIC_COGNITO_USER_POOL_ID: string
        readonly NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: string
        readonly NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: string
        readonly NEXT_PUBLIC_WORKSPACE_S3_BUCKET_NAME: string
      }
    }
  }
}
