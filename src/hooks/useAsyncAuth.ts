import { auth } from '@/services/auth'

export const useAsyncAuth = async () => {
    let expiresDate

    const session = await auth()

    if (!session) {
        // Logout and delete session
    }

    if (session?.expires) {
        expiresDate = Date.parse(session?.expires)
    }

    if (!expiresDate || Date.now() < expiresDate) {
        // Logout
    }
    return session
}
