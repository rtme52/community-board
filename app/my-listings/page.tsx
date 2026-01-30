import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ListingCard from '@/components/ListingCard'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function MyListingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        // .eq('is_hidden', false) // Show all listings for management
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-100">My Listings</h1>
                    <p className="text-stone-400 mt-1">Manage your posted services and requests.</p>
                </div>
                <Link href="/create">
                    <Button className="gap-2">
                        <Plus size={16} />
                        Post New Listing
                    </Button>
                </Link>
            </div>

            {listings && listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 max-w-3xl">
                    {listings.map((item) => (
                        <ListingCard
                            key={item.id}
                            item={{
                                ...item,
                                profiles: { full_name: user.user_metadata?.full_name || 'Me' } // Provide fallback profile for own posts if needed
                            }}
                            currentUserId={user.id}
                            manageMode={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 border border-dashed border-stone-800 rounded-xl bg-stone-900/50">
                    <p className="text-stone-400 text-lg mb-4">You haven't posted any listings yet.</p>
                    <Link href="/create">
                        <Button variant="outline" className="border-stone-700 text-stone-300 hover:text-stone-100">
                            Create your first listing
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
