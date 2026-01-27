
import { createClient } from '@/utils/supabase/server'
// Basic time helper removed as it's now in ListingCard


import ListingCard from './ListingCard'

export default async function Feed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id

    const { data: listings } = await supabase
        .from('listings')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })

    // Group by category
    const categories = ['Services', 'Help Wanted', 'For Sale', 'Free', 'Wanted', 'Events', 'Chat']
    const mainCategories = ['Services', 'Help Wanted']
    const groupedListings: Record<string, any[]> = {}

    categories.forEach(cat => groupedListings[cat] = [])

    if (listings) {
        listings.forEach(item => {
            if (groupedListings[item.category]) {
                groupedListings[item.category].push(item)
            } else {
                if (!groupedListings['Other']) groupedListings['Other'] = []
                groupedListings['Other'].push(item)
            }
        })
    }

    return (
        <div className="space-y-12">
            {/* Main Categories (Services & Help Wanted) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mainCategories.map(category => {
                    const items = groupedListings[category] || []
                    return (
                        <section key={category} className="space-y-4">
                            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-2">
                                <h3 className="text-2xl font-serif font-bold text-stone-100">
                                    {category}
                                </h3>
                                <span className="text-sm font-medium text-stone-500 bg-stone-900 px-2 py-1 rounded-full border border-stone-800">
                                    {items.length} Posts
                                </span>
                            </div>

                            <div className="space-y-3">
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <ListingCard key={item.id} item={item} currentUserId={currentUserId} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 border border-dashed border-stone-800 rounded-lg text-stone-600 italic">
                                        No listings yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Legacy/Other Categories (collapsed at bottom or separate section) */}
            {categories.filter(c => !mainCategories.includes(c)).map(category => {
                const items = groupedListings[category]
                if (!items || items.length === 0) return null

                return (
                    <section key={category} className="space-y-4 opacity-80">
                        <h3 className="text-xl font-serif font-bold text-stone-400 border-b border-stone-800 pb-1">
                            {category} (Archive)
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <ListingCard key={item.id} item={item} currentUserId={currentUserId} />
                            ))}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
