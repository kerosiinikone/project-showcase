import { auth, signOut } from '@/services/auth'

export const useAsyncAuth = async () => {
    let expiresDate

    const session = await auth()

    if (!session) {
        console.log('NO SESSION')
    }

    if (session?.expires) {
        expiresDate = Date.parse(session?.expires)

        if (Date.now() > expiresDate!) {
            await signOut({ redirect: false })
        }
    }
    return session
}
