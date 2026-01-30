'use client'

import { useState } from 'react'
import { toggleAdminVisibility, deleteListingAdmin } from '@/app/admin/actions'
import { Button } from '@/components/ui'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminListingList({ initialListings }: { initialListings: any[] }) {
    const [listings, setListings] = useState(initialListings)
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const handleToggleVisibility = async (id: number, currentHiddenStatus: boolean) => {
        setLoadingId(id)
        // Admin toggles is_admin_hidden, not the user's is_hidden
        const result = await toggleAdminVisibility(id, currentHiddenStatus)
        if (result.success) {
            setListings(listings.map(l => l.id === id ? { ...l, is_admin_hidden: !currentHiddenStatus } : l))
        } else {
            alert('Failed to update listing visibility')
        }
        setLoadingId(null)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this listing PERMANENTLY?')) return

        setLoadingId(id)
        const result = await deleteListingAdmin(id)
        if (result.success) {
            setListings(listings.filter(l => l.id !== id))
        } else {
            alert('Failed to delete listing')
        }
        setLoadingId(null)
    }

    return (
        <div className="border border-stone-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-900/50 text-stone-400 font-medium">
                    <tr>
                        <th className="p-4 border-b border-stone-800">Title / Category</th>
                        <th className="p-4 border-b border-stone-800">Author</th>
                        <th className="p-4 border-b border-stone-800">Status</th>
                        <th className="p-4 border-b border-stone-800 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                    {listings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-stone-900/20 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-stone-200">{listing.title}</div>
                                <div className="text-xs text-stone-500">{listing.category}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-stone-300">
                                    {listing.profiles?.full_name || 'Unknown'}
                                </div>
                                <div className="text-xs text-stone-500">
                                    {listing.is_hidden ? '(User Hidden)' : ''}
                                </div>
                            </td>
                            <td className="p-4">
                                {listing.is_admin_hidden ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-900/20 text-red-500 text-xs text-nowrap">
                                        <EyeOff size={12} /> Admin Hidden
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-900/20 text-green-500 text-xs text-nowrap">
                                        <Eye size={12} /> Visible
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={`${listing.is_admin_hidden ? 'text-green-500 hover:text-green-400' : 'text-stone-400 hover:text-stone-200'}`}
                                    onClick={() => handleToggleVisibility(listing.id, listing.is_admin_hidden)}
                                    disabled={loadingId === listing.id}
                                >
                                    {listing.is_admin_hidden ? (
                                        <><Eye size={14} className="mr-1" /> Show</>
                                    ) : (
                                        <><EyeOff size={14} className="mr-1" /> Hide</>
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                                    onClick={() => handleDelete(listing.id)}
                                    disabled={loadingId === listing.id}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
