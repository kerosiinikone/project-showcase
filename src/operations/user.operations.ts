import { UserType } from '@/models/User/types'
import db from '../services/db.server'
import { users } from '@/services/db/schema'
import { User } from '@/models/User/model'

export function createNewUser(newUser: UserType) {
    const user = new User(newUser)
    return db.insert(users).values(user).returning()
}

export function getExistingUserById(id: string) {
    return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
    })
}
