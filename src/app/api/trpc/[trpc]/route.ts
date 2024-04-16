import { appRouter } from '@/services/trpc/router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => ({
            session: null,
        }),
        onError(opts) {
            const { error } = opts
            if (error.code === 'INTERNAL_SERVER_ERROR') {
                // send to bug reporting (later)
            }
        },
    })
export { handler as GET, handler as POST }
