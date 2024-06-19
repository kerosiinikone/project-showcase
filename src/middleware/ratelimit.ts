import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

export const ratelimit =
    process.env.ENVIRONMENT !== 'test'
        ? new Ratelimit({
              redis: kv,
              limiter: Ratelimit.slidingWindow(5, '10 s'),
          })
        : null
