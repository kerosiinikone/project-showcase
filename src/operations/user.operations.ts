import { UserType } from '@/models/User/types'
import db from '../services/db.server'
import { users } from '@/services/db/schema'
import { User } from '@/models/User/model'

export function createNewUser(newUser: UserType) {
    const user = new User(newUser)
    return db.insert(users).values({
        ...user,
        id: user.id!,
        name: user.name!,
        updated_at: user.updated_at!,
        created_at: user.created_at!,
    })
}

export function getExistingUserById(id: string) {
    return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
    })
}
