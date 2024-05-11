import { auth, signIn, signOut } from '@/services/auth'

export default async function SignIn() {
    const session = await auth()

    return (
        <>
            {!session ? (
                <form
                    action={async (_) => {
                        'use server'
                        await signIn('credentials', {
                            redirect: true,
                            redirectTo: '/',
                        })
                    }}
                >
                    <button>Sign In</button>
                </form>
            ) : (
                <form
                    action={async (_) => {
                        'use server'
                        await signOut({
                            redirect: true,
                            redirectTo: '/',
                        })
                    }}
                >
                    <button>Sign Out</button>
                </form>
            )}
        </>
    )
}
