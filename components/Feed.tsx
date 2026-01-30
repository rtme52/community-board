
import { createClient } from '@/utils/supabase/server'
// Basic time helper removed as it's now in ListingCard


import ListingCard from './ListingCard'
import { Hammer, Search, Briefcase, HandHelping, Calendar, MessageCircle, Archive } from 'lucide-react'

export default async function Feed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id

    const { data: listings } = await supabase
        .from('listings')
        .select('*, profiles(full_name)')
        .eq('is_hidden', false)
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

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Services': return <Hammer size={24} className="text-island-gold-500" />;
            case 'Help Wanted': return <Search size={24} className="text-island-rust-500" />;
            case 'For Sale': return <Briefcase size={24} className="text-stone-400" />;
            case 'Free': return <HandHelping size={24} className="text-stone-400" />;
            case 'Events': return <Calendar size={24} className="text-stone-400" />;
            case 'Chat': return <MessageCircle size={24} className="text-stone-400" />;
            default: return <Archive size={24} className="text-stone-400" />;
        }
    }

    const getSectionStyle = (category: string) => {
        if (category === 'Services') return 'bg-gradient-to-br from-island-gold-900/10 to-transparent p-6 rounded-2xl border border-island-gold-500/30'
        if (category === 'Help Wanted') return 'bg-gradient-to-br from-island-rust-900/10 to-transparent p-6 rounded-2xl border border-island-rust-500/30'
        return ''
    }

    const getIconContainerStyle = (category: string) => {
        if (category === 'Services') return 'bg-island-gold-900/30 border-island-gold-800 text-island-gold-400'
        if (category === 'Help Wanted') return 'bg-island-rust-900/30 border-island-rust-800 text-island-rust-400'
        return 'bg-stone-900 border-stone-800 text-stone-400'
    }

    const getCategoryBadge = (category: string) => {
        if (category === 'Services') {
            return (
                <span className="ml-3 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-island-gold-400 bg-island-gold-950/50 border border-island-gold-900/50 rounded-full">
                    Offering
                </span>
            )
        }
        if (category === 'Help Wanted') {
            return (
                <span className="ml-3 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-island-rust-400 bg-island-rust-950/50 border border-island-rust-900/50 rounded-full">
                    Hiring
                </span>
            )
        }
        return null
    }

    return (
        <div className="space-y-12">
            {/* Main Categories (Services & Help Wanted) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {mainCategories.map(category => {
                    const items = groupedListings[category] || []
                    return (
                        <section key={category} className={`space-y-4 ${getSectionStyle(category)}`}>
                            <div className="flex items-center justify-between border-b border-stone-800/20 pb-4 mb-2">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg border mr-3 ${getIconContainerStyle(category)}`}>
                                        {getCategoryIcon(category)}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-stone-100">
                                        {category}
                                    </h3>
                                    {getCategoryBadge(category)}
                                </div>
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
