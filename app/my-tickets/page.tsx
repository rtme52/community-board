import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getUserTickets } from './actions'
import UserTicketList from '@/components/UserTicketList' // We'll create this to handle client-side view selection

export default async function MyTicketsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: tickets, error } = await getUserTickets()

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold text-stone-100 mb-2">My Support Tickets</h1>
            <p className="text-stone-400 mb-8">View the status of your requests and reply to support.</p>

            {error ? (
                <div className="p-4 border border-red-900/50 bg-red-900/20 text-red-200 rounded-lg">
                    Error loading tickets: {error}
                </div>
            ) : (
                <UserTicketList initialTickets={tickets || []} />
            )}
        </div>
    )
}
