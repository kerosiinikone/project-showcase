'use server'

import { signIn, signOut } from '@/services/auth'

export const signInGithub = async () => await signIn('github')

export const signOutGithub = async () => await signOut()
