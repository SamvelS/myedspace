import { PropsWithChildren } from 'react'
import { useAuth } from '../auth/AuthContext';

type AuthGuardProps  = PropsWithChildren & {
    notAuthenticatedMessage: string;
}

export function AuthGuard({ notAuthenticatedMessage, children } : AuthGuardProps) {
    const { isLoggedIn } = useAuth()
    if (!isLoggedIn) {
        return (
            <div>{notAuthenticatedMessage}</div>
        )
    }

    return <>{children}</>
}