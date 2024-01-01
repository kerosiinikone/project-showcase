import type { AppRouter } from '../../services/trpc/router'
import { createTRPCReact } from '@trpc/react-query'

export const api = createTRPCReact<AppRouter>({})
