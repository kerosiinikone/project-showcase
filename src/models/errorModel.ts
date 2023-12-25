import { ZodError } from 'zod'

export class ValidationError extends Error {
    constructor(message: string, validationErrors: ZodError) {
        super(message)
        this.name = 'ValidationError'
        this.validationErrors = validationErrors
    }

    validationErrors: ZodError
}
