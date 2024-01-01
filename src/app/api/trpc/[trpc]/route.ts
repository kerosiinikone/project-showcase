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
    })
export { handler as GET, handler as POST }