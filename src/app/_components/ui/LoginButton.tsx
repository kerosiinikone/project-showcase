import { Github } from 'lucide-react'
import { signInGithub } from '../../_actions/auth-action'
import { Button } from '@/components/ui/button'

const LoginWithGithubButton = () => {
    return (
        <form action={signInGithub}>
            <Button type="submit">
                <Github className="mr-5" />
                <span>Login with Github</span>
            </Button>
        </form>
    )
}

export default LoginWithGithubButton
