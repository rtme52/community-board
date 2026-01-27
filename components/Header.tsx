
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from './ui'

export default async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-baseline gap-1 group">
                    <span className="font-serif text-2xl font-bold tracking-tight text-stone-100 group-hover:text-white transition-colors">
                        Guemes
                    </span>
                    <span className="font-sans text-sm font-medium tracking-[0.2em] text-stone-400 uppercase group-hover:text-stone-300 transition-colors">
                        Services
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
