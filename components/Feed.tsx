
import { createClient } from '@/utils/supabase/server'
import ListingActions from './ListingActions'

// Basic time helper since I didn't install date-fns yet
function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    // ... same as before
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
}

export default async function Feed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id

    const { data: listings } = await supabase
        .from('listings')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })

    // Group by category
    const categories = ['For Sale', 'Free', 'Wanted', 'Events', 'Services', 'Chat']
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
        <div className="space-y-8">
            {categories.map(category => {
                const items = groupedListings[category]
                if (!items || items.length === 0) return null

                return (
                    <section key={category} className="space-y-4">
                        <h3 className="text-xl font-serif font-bold text-stone-200 border-b-2 border-stone-800 pb-1">
                            {category}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <div key={item.id} className="group relative flex flex-col justify-between rounded-lg border border-stone-800 bg-stone-900 p-4 shadow-sm transition-shadow hover:shadow-md hover:border-stone-700">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-stone-100 text-lg leading-tight">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-stone-500 shrink-0 ml-2">
                                                {timeAgo(item.created_at)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-stone-400 line-clamp-3 whitespace-pre-line">
                                            {item.content}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                                        <span className="font-medium text-stone-500">
                                            {item.profiles?.full_name || 'Anonymous'}
                                        </span>
                                        <ListingActions
                                            listingId={item.id}
                                            isOwner={currentUserId === item.user_id}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            })}

            {(!listings || listings.length === 0) && (
                <div className="text-center py-12 text-stone-500">
                    <p>No listings yet. Be the first to post!</p>
                </div>
            )}
        </div>
    )
}
