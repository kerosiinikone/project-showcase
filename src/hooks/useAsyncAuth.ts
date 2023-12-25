import { auth } from '@/services/auth'

export const useAsyncAuth = async () => {
    const session = await auth()
    return session
}
