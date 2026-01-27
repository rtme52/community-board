'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Trash2, Edit, ChevronDown, ChevronUp, Phone, Mail, MessageSquare, ImageIcon } from 'lucide-react'
import { deleteListing } from '@/app/listings/actions'
import { useTransition } from 'react'

function ListingActions({ listingId, isOwner }: { listingId: number, isOwner: boolean }) {
    const [isPending, startTransition] = useTransition()

    if (!isOwner) return null

    return (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-800">
            <Link href={`/edit/${listingId}`}>
                <Button variant="outline" size="sm" className="h-8 gap-2 border-stone-700 text-stone-400 hover:text-stone-100">
                    <Edit size={14} />
                    <span>Edit</span>
                </Button>
            </Link>
            <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 text-red-500 border-stone-700 hover:bg-red-950 hover:text-red-400 hover:border-red-900"
                disabled={isPending}
                onClick={(e) => {
                    e.stopPropagation() // Prevent toggling the card when deleting
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

function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
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

export default function ListingCard({ item, currentUserId }: { item: any, currentUserId?: string }) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Contact Logic
    const showContact = item.contact_via_call || item.contact_via_text || item.contact_via_email

    // Category Styles
    const getCategoryStyles = (cat: string) => {
        if (cat === 'Services') return {
            border: 'border-l-4 border-l-island-gold-500',
            expandedRing: 'ring-island-gold-500/50',
            hover: 'hover:border-island-gold-500/30'
        }
        if (cat === 'Help Wanted') return {
            border: 'border-l-4 border-l-island-rust-500',
            expandedRing: 'ring-island-rust-500/50',
            hover: 'hover:border-island-rust-500/30'
        }
        return {
            border: 'border-l-4 border-l-transparent',
            expandedRing: 'ring-stone-700',
            hover: 'hover:border-stone-600'
        }
    }

    const styles = getCategoryStyles(item.category)

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
                group relative flex flex-col rounded-lg border border-stone-800/60 bg-stone-900 shadow-sm transition-all cursor-pointer
                ${styles.hover} hover:shadow-md
                ${isExpanded ? `p-6 ring-1 ${styles.expandedRing}` : 'p-4'}
                ${styles.border}
            `}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-stone-100 leading-tight transition-all ${isExpanded ? 'text-xl mb-1' : 'text-lg'}`}>
                            {item.title}
                        </h4>
                        {!isExpanded && item.image_url && (
                            <ImageIcon size={16} className="text-stone-500" />
                        )}
                    </div>

                    {!isExpanded && (
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                            <span className="font-medium text-stone-400">
                                {item.profiles?.full_name || 'Anonymous'}
                            </span>
                            <span>•</span>
                            <span>{timeAgo(item.created_at)}</span>
                            
                            {showContact && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1.5 bg-stone-800/80 px-2 py-0.5 rounded-full border border-stone-700/50 text-stone-300">
                                        <div className="flex -space-x-1">
                                            {(item.contact_via_call || item.contact_via_text) && <Phone size={10} />}
                                            {item.contact_via_email && <Mail size={10} />}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Contact</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {!isExpanded && item.image_url && (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-stone-800 border border-stone-700 shrink-0">
                            <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                        </div>
                    )}
                    <div className="text-stone-500 transition-transform duration-200">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-4 pb-4 border-b border-stone-800">
                        <span className="font-medium text-stone-300">
                            Posted by {item.profiles?.full_name || 'Anonymous'}
                        </span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>

                    {item.image_url && (
                        <div className="mb-6 rounded-lg overflow-hidden border border-stone-800 bg-stone-950">
                            <img src={item.image_url} alt={item.title} className="w-full max-h-96 object-contain" />
                        </div>
                    )}

                    <p className="text-sm text-stone-300 whitespace-pre-line leading-relaxed mb-6">
                        {item.content}
                    </p>

                    {showContact && (
                        <div className="bg-stone-950/50 rounded-md p-4 border border-stone-800 mb-2">
                            <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Contact Information</h5>
                            <div className="space-y-3">
                                {(item.contact_via_call || item.contact_via_text) && item.contact_phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-stone-800/50 text-stone-400">
                                            {item.contact_via_call && !item.contact_via_text ? <Phone size={16} /> :
                                                !item.contact_via_call && item.contact_via_text ? <MessageSquare size={16} /> :
                                                    <div className="flex -space-x-1"><Phone size={14} /><MessageSquare size={14} /></div>}
                                        </div>
                                        <div>
                                            <p className="text-stone-200 font-mono text-sm select-all">{item.contact_phone}</p>
                                            <p className="text-[10px] text-stone-500 uppercase font-bold">
                                                {item.contact_via_call && item.contact_via_text ? 'Call or Text' : item.contact_via_call ? 'Call Only' : 'Text Only'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {item.contact_via_email && item.contact_email && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-stone-800/50 text-stone-400">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className="text-stone-200 font-mono text-sm select-all">{item.contact_email}</p>
                                            <p className="text-[10px] text-stone-500 uppercase font-bold">Email</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <ListingActions
                        listingId={item.id}
                        isOwner={currentUserId === item.user_id}
                    />
                </div>
            )}
        </div>
    )
}
