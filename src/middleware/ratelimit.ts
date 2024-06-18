// HOX: Switch to a KV store outside memory

const idToRequestCount = new Map<string, number>()

const rateLimiter = {
    windowStart: Date.now(),
    windowSize: 10 * 1000,
    maxRequests: 5,
}

export const limit = (ip: string) => {
    const now = Date.now()
    const isNewWindow =
        now - rateLimiter.windowStart > rateLimiter.windowSize
    if (isNewWindow) {
        rateLimiter.windowStart = now
        idToRequestCount.set(ip, 0)
    }

    const currentRequestCount = idToRequestCount.get(ip) ?? 0
    if (currentRequestCount >= rateLimiter.maxRequests) return true
    idToRequestCount.set(ip, currentRequestCount + 1)

    return false
}
