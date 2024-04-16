import { auth, signOut } from '@/services/auth'

export const useAsyncAuth = async () => {
    let expiresDate

    const session = await auth()

    if (!session) {
        // Sign IN
    }

    if (session?.expires) {
        expiresDate = Date.parse(session?.expires)

        if (Date.now() > expiresDate!) {
            await signOut({ redirect: false })
        }
    }
    return session
}
