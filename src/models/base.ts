import { ZodError, ZodSchema } from 'zod'
import { ValidationError } from './errorModel'

// Change the Design Pattern (later)

type ValidationMixin = <T extends new (...args: any[]) => any>(
    Base: T
) => {
    new (...args: ConstructorParameters<T>): {
        validate_schema(schema: ZodSchema): void
    }
}

export class BaseModel {
    name: string
    id: string
    created_at: Date
    updated_at: Date
    image?: string | null | undefined

    constructor(
        name: string | undefined,
        id: string | undefined,
        image: string | null | undefined = null
    ) {
        this.name = name!
        this.id = id!
        this.image = image
        this.created_at = new Date()
        this.updated_at = new Date()
    }
}

export const validationMixin: ValidationMixin = (Base) => {
    return class extends Base {
        private validate_schema(schema: ZodSchema): void {
            try {
                schema.parse(this)
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new ValidationError('Validation Failed', error)
                } else {
                    throw error
                }
            }
        }
    }
}
