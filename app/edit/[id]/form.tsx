'use client'

import { Button, Input, Label, Textarea } from '@/components/ui'
import { updateListing } from '@/app/listings/actions'
import { useState } from 'react'

export default function EditListingForm({ listing }: { listing: any }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const res = await updateListing(listing.id, formData)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={listing.title} required className="mt-1" />
            </div>

            <div>
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    name="category"
                    defaultValue={listing.category}
                    className="flex h-10 w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 ring-offset-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    required
                >
                    <option value="For Sale">For Sale</option>
                    <option value="Free">Free</option>
                    <option value="Wanted">Wanted</option>
                    <option value="Events">Events</option>
                    <option value="Services">Services</option>
                    <option value="Chat">Chat</option>
                </select>
            </div>

            <div>
                <Label htmlFor="content">Description</Label>
                <Textarea id="content" name="content" defaultValue={listing.content} required className="mt-1 h-32" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Update Listing' : 'Save Changes'}
            </Button>
        </form>
    )
}
