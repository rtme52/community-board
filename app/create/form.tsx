'use client'

import { Button, Input, Label, Textarea } from '@/components/ui'
import { createListing } from './actions'
import { useState } from 'react'

export default function CreateListingForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const res = await createListing(formData)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Dog Walking, Garden Help, etc." required className="mt-1" />
            </div>

            <div>
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    name="category"
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 ring-offset-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    required
                >
                    <option value="" disabled>Select a category</option>
                    <option value="Services">Services (Offering)</option>
                    <option value="Help Wanted">Help Wanted (Hiring)</option>
                </select>
            </div>

            <div>
                <Label htmlFor="content">Description</Label>
                <Textarea id="content" name="content" placeholder="Describe your service or help requested..." required className="mt-1 h-32" />
            </div>

            <div className="space-y-4 border-t border-stone-800 pt-4">
                <h3 className="text-lg font-medium text-stone-200">Contact Info</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contact_phone">Phone (Optional)</Label>
                        <Input id="contact_phone" name="contact_phone" type="tel" placeholder="555-123-4567" className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="contact_email">Email (Optional)</Label>
                        <Input id="contact_email" name="contact_email" type="email" placeholder="you@example.com" className="mt-1" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Best Contact Method(s)</Label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="contact_via_call" className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-stone-100 focus:ring-stone-400" />
                            <span className="text-sm text-stone-300">Phone Call</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="contact_via_text" className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-stone-100 focus:ring-stone-400" />
                            <span className="text-sm text-stone-300">Text Message</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="contact_via_email" className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-stone-100 focus:ring-stone-400" />
                            <span className="text-sm text-stone-300">Email</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-800 pt-4">
                <Label htmlFor="image">Photo (Optional)</Label>
                <Input id="image" name="image" type="file" accept="image/*" className="mt-1 file:text-stone-300 cursor-pointer" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Posting...' : 'Post Listing'}
            </Button>
        </form>
    )
}
