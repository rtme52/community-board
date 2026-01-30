'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'

import { Trash2, Edit, ChevronDown, ChevronUp, Phone, Mail, MessageSquare, ImageIcon, User as UserIcon, Calendar, Contact, Eye, EyeOff } from 'lucide-react'
import ProtectedContactInfo from './ProtectedContactInfo'

import { deleteListing, toggleListingVisibility } from '@/app/listings/actions'
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

export default function ListingCard({ item, currentUserId, manageMode = false }: { item: any, currentUserId?: string, manageMode?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Contact Logic
    const showContact = item.contact_via_call || item.contact_via_text || item.contact_via_email

    // Category Styles
    const getCategoryStyles = (cat: string) => {
        if (cat === 'Services') return {
            border: 'border-l-4 border-l-island-gold-500',
            expandedRing: 'ring-1 ring-island-gold-500/50',
            hover: 'hover:border-island-gold-500/30',
            expandedBg: 'bg-gradient-to-b from-stone-900 to-island-gold-950/20',
            iconColor: 'text-island-gold-500',
            contactBg: 'bg-island-gold-950/30 border-island-gold-900/50'
        }
        if (cat === 'Help Wanted') return {
            border: 'border-l-4 border-l-island-rust-500',
            expandedRing: 'ring-1 ring-island-rust-500/50',
            hover: 'hover:border-island-rust-500/30',
            expandedBg: 'bg-gradient-to-b from-stone-900 to-island-rust-950/20',
            iconColor: 'text-island-rust-500',
            contactBg: 'bg-island-rust-950/30 border-island-rust-900/50'
        }
        return {
            border: 'border-l-4 border-l-stone-700',
            expandedRing: 'ring-1 ring-stone-700',
            hover: 'hover:border-stone-600',
            expandedBg: 'bg-stone-900',
            iconColor: 'text-stone-400',
            contactBg: 'bg-stone-800/50 border-stone-700/50'
        }
    }

    const styles = getCategoryStyles(item.category)

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
                group relative flex flex-col rounded-xl border border-stone-800/60 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden
                ${styles.hover} hover:shadow-lg
                ${isExpanded ? `${styles.expandedBg} ${styles.expandedRing} shadow-md` : 'bg-stone-900 p-4'}
                ${!isExpanded && styles.border}
                ${manageMode && (item.is_hidden || item.is_admin_hidden) ? 'opacity-75 border-stone-800 border-dashed bg-stone-950/50' : ''}
            `}
        >
            {/* Collapsed Header */}
            <div className={`flex justify-between items-start gap-4 ${isExpanded ? 'p-6 pb-2' : ''}`}>
                <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-3">
                        {isExpanded && item.image_url && (
                            // Small thumbnail in header when expanded if wanted, or maybe just rely on hero? 
                            // Let's keep it clean.
                            <></>
                        )}
                        <h4 className={`font-serif font-bold text-stone-100 leading-tight transition-all ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
                            {item.title}
                        </h4>
                        {!isExpanded && item.image_url && (
                            <ImageIcon size={16} className="text-stone-400" />
                        )}
                    </div>

                    {!isExpanded && (
                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-2">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${item.profiles?.full_name ? 'bg-stone-600' : 'bg-stone-800'}`}></span>
                                <span className="font-medium text-stone-400">
                                    {item.profiles?.full_name || 'Anonymous'}
                                </span>
                            </div>
                            <span>•</span>
                            <span>{timeAgo(item.created_at)}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                    {!isExpanded && item.image_url && (
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-stone-800 border border-stone-700/50 shrink-0">
                            <img src={item.image_url} alt="" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    <div className={`text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>

                {/* Management Actions (Visible in manageMode without expansion) */}
                {manageMode && currentUserId === item.user_id && (
                    <div className="flex items-center gap-2 pr-4 pl-2" onClick={(e) => e.stopPropagation()}>
                        {item.is_admin_hidden ? (
                            <span className="text-[10px] font-bold text-red-500 bg-red-950/30 px-2 py-1 rounded border border-red-900/50 uppercase tracking-wider mr-2 cursor-help" title="This listing has been hidden by an administrator. Please contact support.">
                                Removed by Admin
                            </span>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${item.is_hidden ? 'text-stone-400 hover:text-stone-300' : 'text-stone-400 hover:text-stone-100'}`}
                                title={item.is_hidden ? "Unhide Listing" : "Hide Listing"}
                                disabled={isPending}
                                onClick={() => startTransition(async () => {
                                    await toggleListingVisibility(item.id, !item.is_hidden)
                                })}
                            >
                                {item.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                        )}

                        <Link href={`/edit/${item.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-100" title="Edit Listing">
                                <Edit size={16} />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-stone-400 hover:text-red-400"
                            title="Delete Listing"
                            disabled={isPending}
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this listing?')) {
                                    startTransition(async () => {
                                        await deleteListing(item.id)
                                    })
                                }
                            }}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1 duration-300">

                    {/* Metadata Row */}
                    <div className="flex items-center gap-4 text-xs text-stone-400 mb-6 mt-1 border-b border-stone-800/50 pb-4">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${styles.contactBg}`}>
                                <UserIcon size={12} className={styles.iconColor} />
                            </div>
                            <span className="font-medium text-stone-300">
                                {item.profiles?.full_name || 'Anonymous'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${styles.contactBg}`}>
                                <Calendar size={12} className={styles.iconColor} />
                            </div>
                            <span>{new Date(item.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-invert max-w-none mb-8">
                        <p className="text-base text-stone-200 whitespace-pre-line leading-relaxed font-light tracking-wide">
                            {item.content}
                        </p>
                    </div>

                    {/* Contact Card */}
                    {showContact && (
                        <div className={`rounded-xl p-5 border backdrop-blur-sm ${styles.contactBg} mb-6`}>
                            <h5 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${styles.iconColor}`}>
                                <Contact size={14} />
                                Contact Information
                            </h5>

                            <ProtectedContactInfo>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(item.contact_via_call || item.contact_via_text) && item.contact_phone && (
                                        <div className="flex items-center gap-3 bg-stone-950/30 p-3 rounded-lg border border-stone-800/30">
                                            <div className={`p-2.5 rounded-full bg-stone-900 border border-stone-800 ${styles.iconColor}`}>
                                                {item.contact_via_call && !item.contact_via_text ? <Phone size={18} /> :
                                                    !item.contact_via_call && item.contact_via_text ? <MessageSquare size={18} /> :
                                                        <div className="flex -space-x-1"><Phone size={14} /><MessageSquare size={14} /></div>}
                                            </div>
                                            <div>
                                                <p className="text-stone-100 font-mono text-base font-medium select-all hover:text-white transition-colors cursor-text">{item.contact_phone}</p>
                                                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mt-0.5">
                                                    {item.contact_via_call && item.contact_via_text ? 'Call or Text' : item.contact_via_call ? 'Call Only' : 'Text Only'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {item.contact_via_email && item.contact_email && (
                                        <div className="flex items-center gap-3 bg-stone-950/30 p-3 rounded-lg border border-stone-800/30">
                                            <div className={`p-2.5 rounded-full bg-stone-900 border border-stone-800 ${styles.iconColor}`}>
                                                <Mail size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-stone-100 font-mono text-sm font-medium select-all truncate hover:text-white transition-colors cursor-text" title={item.contact_email}>{item.contact_email}</p>
                                                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mt-0.5">Email</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ProtectedContactInfo>

                        </div>
                    )}

                    {/* Hero Image - Moved below contact */}
                    {item.image_url && (
                        <div className="mb-6 rounded-lg overflow-hidden border border-stone-800/50 shadow-lg bg-black/40 max-w-sm mx-auto">
                            <img src={item.image_url} alt={item.title} className="w-full max-h-[300px] object-contain" />
                        </div>
                    )}

                    <ListingActions
                        listingId={item.id}
                        isOwner={currentUserId === item.user_id}
                    />

                    {!currentUserId && (
                        <div className="mt-6 pt-4 border-t border-stone-800 text-center">
                            <p className="text-xs text-stone-400">
                                Own this listing? <Link href="/login" className="text-island-gold-500 hover:text-island-gold-400 hover:underline">Sign in</Link> to edit or delete.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
