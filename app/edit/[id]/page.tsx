
import { createClient } from '@/utils/supabase/server'
import EditListingForm from './form'
import { redirect } from 'next/navigation'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params as per Next.js 15 breaking change? 
    // Next.js 15: "Route params are now promises".
    // Assuming this is Next 15, I need to await params.
    const { id } = await params

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: listing } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

    if (!listing) {
        return <div>Listing not found</div>
    }

    if (listing.user_id !== user.id) {
        return <div>Unauthorized</div>
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-serif font-bold text-stone-100">Edit Listing</h1>
            <div className="rounded-lg border border-stone-800 bg-stone-900 p-6 shadow-sm">
                <EditListingForm listing={listing} />
            </div>
        </div>
    )
}
