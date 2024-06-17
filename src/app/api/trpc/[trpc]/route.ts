import { appRouter } from '@/services/trpc/router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from '@/services/trpc'

const handler = (req: Request) => {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext,
        onError(opts) {
            const { error } = opts
            if (error.code === 'INTERNAL_SERVER_ERROR') {
                // send to bug reporting (later)
            }
        },
    })
}
export { handler as GET, handler as POST }
