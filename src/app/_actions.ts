'use server'

import { signIn, signOut } from '@/services/auth'

export async function signInGithub() {
    await signIn('github')
}

export async function signOutGithub() {
    await signOut()
}
