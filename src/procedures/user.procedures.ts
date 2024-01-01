import { UserSchema } from '@/models/User/model'
import { UserType } from '@/models/User/types'
import {
    createNewUser,
    getExistingUserById,
} from '@/operations/user.operations'
import { procedure } from '@/services/trpc'
import { z } from 'zod'

export default {
    createUserAction: procedure
        .input(UserSchema)
        .mutation(async ({ input }) => {
            try {
                return (await createNewUser(input as UserType))[0]
            } catch (error) {
                throw error
            }
        }),
    getExistingUserAction: procedure
        .input(z.string().length(36))
        .query(async ({ input }) => {
            const id = input
            try {
                return (await getExistingUserById(id))[0]
            } catch (error) {
                throw error
            }
        }),
}
