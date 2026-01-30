'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { banUser, unbanUser } from '@/app/admin/actions'
import { Button } from './ui'
import { ShieldAlert, Clock, CheckCircle, MessageSquare } from 'lucide-react'

type Profile = {
    id: string
    full_name: string
    created_at: string
    is_banned: boolean
    banned_until: string | null
}

export default function AdminUserList({ initialUsers }: { initialUsers: Profile[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const users = initialUsers

    return (
        <div className="rounded-lg border border-stone-800 bg-stone-900 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-400">
                    <thead className="bg-stone-950/50 text-stone-200 font-serif uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-stone-500 italic">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-stone-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-stone-200">
                                        {user.full_name || 'Anonymous'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_banned ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/50 text-red-500 border border-red-900/50">
                                                <ShieldAlert size={12} />
                                                {user.banned_until ? 'Timeout' : 'Banned'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-950/30 text-green-500 border border-green-900/30">
                                                <CheckCircle size={12} />
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Timeout Button */}
                                            <Button
                                                size="sm"
                                                variant={user.is_banned && user.banned_until ? "default" : "ghost"}
                                                disabled={isPending}
                                                onClick={() => {
                                                    if (user.is_banned && user.banned_until) {
                                                        // Toggle OFF (Unban)
                                                        if (confirm(`Remove timeout for ${user.full_name}?`)) {
                                                            startTransition(async () => {
                                                                const result = await unbanUser(user.id)
                                                                if (result.error) {
                                                                    alert(`Error: ${result.error}`)
                                                                } else {
                                                                    alert('Timeout removed.')
                                                                    router.refresh()
                                                                }
                                                            })
                                                        }
                                                    } else {
                                                        // Toggle ON (Timeout 24h)
                                                        if (confirm(`Timeout ${user.full_name} for 24 hours?`)) {
                                                            startTransition(async () => {
                                                                const result = await banUser(user.id, false, 24)
                                                                if (result.error) {
                                                                    alert(`Error: ${result.error}`)
                                                                } else {
                                                                    alert('User timed out for 24 hours.')
                                                                    router.refresh()
                                                                }
                                                            })
                                                        }
                                                    }
                                                }}
                                                className={`h-8 ${user.is_banned && user.banned_until
                                                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                                                    : "text-stone-400 hover:text-orange-400"
                                                    }`}
                                                title={user.is_banned && user.banned_until ? "Remove Timeout" : "Timeout 24h"}
                                            >
                                                <Clock size={16} className={user.is_banned && user.banned_until ? "fill-current" : ""} />
                                            </Button>

                                            {/* Ban Button */}
                                            <Button
                                                size="sm"
                                                variant={user.is_banned && !user.banned_until ? "destructive" : "ghost"}
                                                disabled={isPending}
                                                onClick={() => {
                                                    if (user.is_banned && !user.banned_until) {
                                                        // Toggle OFF (Unban)
                                                        if (confirm(`Unban ${user.full_name}?`)) {
                                                            startTransition(async () => {
                                                                const result = await unbanUser(user.id)
                                                                if (result.error) {
                                                                    alert(`Error: ${result.error}`)
                                                                } else {
                                                                    alert('User unbanned.')
                                                                    router.refresh()
                                                                }
                                                            })
                                                        }
                                                    } else {
                                                        // Toggle ON (Ban)
                                                        if (confirm(`Permanently BAN ${user.full_name}?`)) {
                                                            startTransition(async () => {
                                                                const result = await banUser(user.id, true)
                                                                if (result.error) {
                                                                    alert(`Error: ${result.error}`)
                                                                } else {
                                                                    alert('User permanently banned.')
                                                                    router.refresh()
                                                                }
                                                            })
                                                        }
                                                    }
                                                }}
                                                className={`h-8 ${user.is_banned && !user.banned_until
                                                    ? "bg-red-900 border border-red-800 text-red-100 hover:bg-red-950"
                                                    : "text-stone-400 hover:text-red-500"
                                                    }`}
                                                title={user.is_banned && !user.banned_until ? "Unban User" : "Permanently Ban"}
                                            >
                                                <ShieldAlert size={16} className={user.is_banned && !user.banned_until ? "fill-current" : ""} />
                                            </Button>

                                            {/* Message Button */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                disabled={isPending}
                                                onClick={() => {
                                                    const message = prompt(`Send message to ${user.full_name}:\n(This will open a new support ticket)`)
                                                    if (message?.trim()) {
                                                        startTransition(async () => {
                                                            const { openAdminTicket } = await import('@/app/admin/actions')
                                                            const result = await openAdminTicket(user.id, message)
                                                            if (result.error) {
                                                                alert(`Error: ${result.error}`)
                                                            } else {
                                                                alert('Ticket created! Check "Support Tickets" to view the thread.')
                                                                router.refresh()
                                                            }
                                                        })
                                                    }
                                                }}
                                                className="h-8 text-stone-400 hover:text-blue-400"
                                                title="Open Support Ticket"
                                            >
                                                <MessageSquare size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
