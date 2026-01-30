'use client'

import { useState } from 'react'
import { getUserTicketDetails, replyAsUser } from '@/app/my-tickets/actions'
import TicketDetail from '@/components/TicketDetail'
import { Button } from '@/components/ui'
import { ChevronRight, Clock, CheckCircle, ArrowLeft } from 'lucide-react'

export default function UserTicketList({ initialTickets }: { initialTickets: any[] }) {
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
    const [detailData, setDetailData] = useState<{ ticket: any, replies: any[] } | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSelectTicket = async (id: number) => {
        setLoading(true)
        setSelectedTicketId(id)
        const result = await getUserTicketDetails(id)
        if (result.data) {
            setDetailData(result.data)
        } else {
            alert('Failed to load ticket details')
            setSelectedTicketId(null)
        }
        setLoading(false)
    }

    const handleBack = () => {
        setSelectedTicketId(null)
        setDetailData(null)
    }

    // Refresh details after reply
    const handleReply = async (message: string) => {
        if (!selectedTicketId) return { error: 'No ticket selected' }
        const result = await replyAsUser(selectedTicketId, message)
        if (result.success) {
            // Refresh local data
            const newData = await getUserTicketDetails(selectedTicketId)
            if (newData.data) {
                setDetailData(newData.data)
            }
        }
        return result
    }

    if (selectedTicketId && detailData) {
        return (
            <div>
                <Button variant="ghost" className="mb-4 pl-0 text-stone-400 hover:text-stone-200" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" /> Back to My Tickets
                </Button>
                <TicketDetail
                    ticket={detailData.ticket}
                    replies={detailData.replies}
                    onReply={handleReply}
                />
            </div>
        )
    }

    if (loading) {
        return <div className="text-stone-400 animate-pulse">Loading ticket details...</div>
    }

    if (initialTickets.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl text-stone-500">
                You haven't submitted any support tickets yet.
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {initialTickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className="p-4 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group"
                    onClick={() => handleSelectTicket(ticket.id)}
                >
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="font-bold text-stone-200 group-hover:text-island-gold-400 transition-colors">
                                {ticket.message.substring(0, 60)}...
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-stone-500">
                                <span>#{ticket.id}</span>
                                <span>•</span>
                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                {ticket.status === 'resolved' ? (
                                    <span className="flex items-center gap-1 text-green-500">
                                        <CheckCircle size={12} /> Resolved
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-blue-400">
                                        <Clock size={12} /> Open
                                    </span>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="text-stone-700 group-hover:text-stone-500" />
                    </div>
                </div>
            ))}
        </div>
    )
}
