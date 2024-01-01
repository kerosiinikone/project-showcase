'use server'

import { deleteProjectServer } from '@/services/trpc/server'
import { redirect } from 'next/navigation'

export default async function deleteProject(pid: string) {
    await deleteProjectServer(pid) // Extra Layer
    // revalidatePath("/") ???
    redirect('/')
}
