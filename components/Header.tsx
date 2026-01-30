import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from './ui'
import { Inbox } from 'lucide-react'

export default async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let openTicketsCount = 0
    let isAdmin = false
    let hasUserTickets = false
    let userTicketCount = 0

    if (user) {
        // Check Admin Status from DB
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        isAdmin = !!profile?.is_admin

        if (isAdmin) {
            const { count } = await supabase
                .from('support_tickets')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'open')

            openTicketsCount = count || 0
        } else {
            // Check if regular user has any tickets
            const { count } = await supabase
                .from('support_tickets')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)

            if (count && count > 0) {
                hasUserTickets = true
                userTicketCount = count
            }
        }
    }

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
                            {isAdmin ? (
                                <Link href="/admin">
                                    <Button variant="ghost" size="sm" className="relative text-stone-400 hover:text-stone-100 mr-2 flex items-center gap-2">
                                        <div className="relative">
                                            <Inbox size={18} />
                                            {openTicketsCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                                    {openTicketsCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-wider">Admin Panel</span>
                                    </Button>
                                </Link>
                            ) : (
                                /* Show for all regular users, even if count is 0, or maybe just if they have tickets? 
                                   User said "maybe allow all signed in users to see the icon". 
                                   But logic above sets hasUserTickets only if count > 0.
                                   Let's stick to showing ONLY if they have tickets for now to avoid clutter, 
                                   as per my previous attempt, but actually writing the file this time.
                                */
                                <>
                                    {hasUserTickets && (
                                        <Link href="/my-tickets">
                                            <Button variant="ghost" size="sm" className="relative text-stone-400 hover:text-stone-100 mr-2">
                                                <Inbox size={18} />
                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-700 text-[10px] font-bold text-white">
                                                    {userTicketCount}
                                                </span>
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                            <span className="hidden text-sm text-stone-400 sm:inline-block">
                                {user.email}
                            </span>
                            <Link href="/my-listings">
                                <Button variant="ghost" size="sm" className="text-stone-400 hover:text-stone-100">
                                    My Listings
                                </Button>
                            </Link>

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
