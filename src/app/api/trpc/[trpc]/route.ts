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
        // responseMeta(opts) {
        //     const { ctx, paths, errors, type } = opts
        //     const allPublic =
        //         paths &&
        //         paths.every((path) => path.includes('public'))
        //     const allOk = errors.length === 0
        //     const isQuery = type === 'query'
        //     if (allPublic && allOk && isQuery) {
        //         const ONE_DAY_IN_SECONDS = 60 * 60 * 24
        //         return {
        //             headers: {
        //                 'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        //             },
        //         }
        //     }
        //     return {}
        // },
        onError(opts) {
            const { error, type, path, input, ctx, req } = opts
            console.error('Error:', error)
            if (error.code === 'INTERNAL_SERVER_ERROR') {
                // send to bug reporting (later)
            }
        },
    })
export { handler as GET, handler as POST }
