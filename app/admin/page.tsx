import { getTickets, getAdminListings, getAdminStats, getUsers } from './actions'
import AdminTicketList from '@/components/AdminTicketList'
import AdminListingList from '@/components/AdminListingList'
import AdminStats from '@/components/AdminStats'
import AdminUserList from '@/components/AdminUserList'

export default async function AdminPage() {
    // Fetch data on the server
    const { data: tickets, error: ticketsError } = await getTickets()
    const { data: listings, error: listingsError } = await getAdminListings()
    const { data: stats, error: statsError } = await getAdminStats()
    const { data: users, error: usersError } = await getUsers()

    if (ticketsError) return <div className="text-red-500">Error loading tickets: {ticketsError}</div>
    if (listingsError) return <div className="text-red-500">Error loading listings: {listingsError}</div>
    if (usersError) return <div className="text-red-500">Error loading users: {usersError}</div>

    return (
        <div className="space-y-12">

            {/* Stats Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-stone-100 border-b border-stone-800 pb-2">
                    Platform Growth
                </h2>
                {stats && <AdminStats totalUsers={stats.totalUsers} totalListings={stats.totalListings} />}
            </section>

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

            {/* User Management Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-stone-100 border-b border-stone-800 pb-2">
                    User Management
                </h2>
                <AdminUserList initialUsers={users || []} />
            </section>
        </div>
    )
}
