
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from './ui'

export default async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-stone-50 text-stone-950 flex items-center justify-center font-serif font-bold text-xl rounded-md">
                        G
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight text-stone-100">
                        guemes.services
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden text-sm text-stone-400 sm:inline-block">
                                {user.email}
                            </span>
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost">
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
