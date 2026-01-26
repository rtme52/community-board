'use client'

import { Button } from '@/components/ui'
import { deleteListing } from '@/app/listings/actions'
import Link from 'next/link'
import { Trash2, Edit } from 'lucide-react'
import { useTransition } from 'react'

export default function ListingActions({ listingId, isOwner }: { listingId: number, isOwner: boolean }) {
    const [isPending, startTransition] = useTransition()

    if (!isOwner) return null

    return (
        <div className="flex items-center gap-2">
            <Link href={`/edit/${listingId}`}>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                    <Edit size={14} />
                    <span>Edit</span>
                </Button>
            </Link>
            <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 text-red-500 border-stone-700 hover:bg-red-950 hover:text-red-400 hover:border-red-900"
                disabled={isPending}
                onClick={() => {
                    if (confirm('Are you sure you want to delete this listing?')) {
                        startTransition(() => {
                            deleteListing(listingId)
                        })
                    }
                }}
            >
                <Trash2 size={14} />
                <span>Delete</span>
            </Button>
        </div>
    )
}
