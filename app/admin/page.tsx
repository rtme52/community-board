import { getTickets, getAdminListings } from './actions'
import AdminTicketList from '@/components/AdminTicketList'
import AdminListingList from '@/components/AdminListingList'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs' // Assuming we don't have this yet, using simple state or just rendering both for now

export default async function AdminPage() {
    // Fetch data on the server
    const { data: tickets, error: ticketsError } = await getTickets()
    const { data: listings, error: listingsError } = await getAdminListings()

    if (ticketsError) return <div className="text-red-500">Error loading tickets: {ticketsError}</div>
    if (listingsError) return <div className="text-red-500">Error loading listings: {listingsError}</div>

    return (
        <div className="space-y-12">

            {/* Support Tickets Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-stone-100 border-b border-stone-800 pb-2">
                    Support Tickets ({tickets?.filter(t => t.status === 'open').length || 0} Open)
                </h2>
                <AdminTicketList initialTickets={tickets || []} />
            </section>

            {/* Listings Management Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-stone-100 border-b border-stone-800 pb-2">
                    Manage Listings
                </h2>
                <AdminListingList initialListings={listings || []} />
            </section>
        </div>
    )
}
