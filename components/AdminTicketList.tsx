'use client'

import { useState } from 'react'
import { resolveTicket, deleteTicket, replyToTicket, getTicketDetails } from '@/app/admin/actions'
import { Button } from '@/components/ui'
import { CheckCircle, Trash2, Clock, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react'
import TicketDetail from '@/components/TicketDetail'

export default function AdminTicketList({ initialTickets }: { initialTickets: any[] }) {
    const [tickets, setTickets] = useState(initialTickets)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
    const [detailData, setDetailData] = useState<{ ticket: any, replies: any[] } | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    const handleSelectTicket = async (id: number) => {
        setDetailLoading(true)
        setSelectedTicketId(id)
        const result = await getTicketDetails(id)
        if (result.data) {
            setDetailData(result.data)
        } else {
            alert('Failed to load ticket details')
            setSelectedTicketId(null)
        }
        setDetailLoading(false)
    }

    const handleReply = async (message: string) => {
        if (!selectedTicketId) return { error: 'No ticket selected' }
        const result = await replyToTicket(selectedTicketId, message)
        if (result.success) {
            // Refresh details
            const newData = await getTicketDetails(selectedTicketId)
            if (newData.data) {
                setDetailData(newData.data)
            }
        }
        return result
    }

    const handleBack = () => {
        setSelectedTicketId(null)
        setDetailData(null)
    }

    const handleResolve = async (id: number) => {
        setLoadingId(id)
        const result = await resolveTicket(id)
        if (result.success) {
            setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolved' } : t))
        } else {
            alert('Failed to resolve ticket')
        }
        setLoadingId(null)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this ticket?')) return

        setLoadingId(id)
        const result = await deleteTicket(id)
        if (result.success) {
            setTickets(tickets.filter(t => t.id !== id))
        } else {
            alert('Failed to delete ticket')
        }
        setLoadingId(null)
    }

    if (tickets.length === 0) {
        return <div className="text-stone-500 italic">No tickets found.</div>
    }

    if (selectedTicketId && detailData) {
        return (
            <div>
                <Button variant="ghost" className="mb-4 pl-0 text-stone-400 hover:text-stone-200" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-stone-100">Ticket #{detailData.ticket.id} Thread</h2>
                    <div className="flex gap-2">
                        {detailData.ticket.status !== 'resolved' && (
                            <Button
                                size="sm"
                                className="h-8 bg-green-700 hover:bg-green-600 text-white"
                                onClick={() => handleResolve(detailData.ticket.id)}
                            >
                                <CheckCircle size={14} className="mr-1" /> Resolve
                            </Button>
                        )}
                    </div>
                </div>
                <TicketDetail
                    ticket={detailData.ticket}
                    replies={detailData.replies}
                    onReply={handleReply}
                    isAdminView={true}
                />
            </div>
        )
    }

    if (detailLoading) {
        return <div className="text-stone-400 animate-pulse">Loading thread...</div>
    }

    return (
        <div className="grid gap-4">
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className={`p-4 rounded-lg border ${ticket.status === 'resolved'
                        ? 'bg-stone-900/30 border-stone-800 opacity-60'
                        : 'bg-stone-900 border-stone-700'
                        }`}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 flex-grow">
                            <div className="flex items-baseline gap-2">
                                <h3 className="font-bold text-stone-200">{ticket.name}</h3>
                                <span className="text-xs text-stone-500">{new Date(ticket.created_at).toLocaleString()}</span>
                                {ticket.status === 'resolved' ? (
                                    <span className="px-2 py-0.5 text-[10px] bg-green-900/30 text-green-500 border border-green-900/50 rounded-full flex items-center gap-1">
                                        <CheckCircle size={10} /> Resolved
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 text-[10px] bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded-full flex items-center gap-1">
                                        <Clock size={10} /> Open
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-stone-400 font-mono bg-stone-950/50 p-1 rounded inline-block">
                                {ticket.email}
                            </div>
                            <p className="text-stone-300 text-sm whitespace-pre-wrap">{ticket.message}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-2 text-stone-400 border-stone-700 hover:text-stone-300"
                                onClick={() => handleSelectTicket(ticket.id)}
                            >
                                <MessageSquare size={14} className="mr-1" />
                                View Thread
                            </Button>

                            {ticket.status !== 'resolved' && (
                                <Button
                                    size="sm"
                                    className="h-8 bg-green-700 hover:bg-green-600 text-white"
                                    onClick={() => handleResolve(ticket.id)}
                                    disabled={loadingId === ticket.id}
                                >
                                    <CheckCircle size={14} className="mr-1" />
                                    Resolve
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-900/50 text-red-500 hover:text-red-400 hover:bg-red-950/50"
                                onClick={() => handleDelete(ticket.id)}
                                disabled={loadingId === ticket.id}
                            >
                                <Trash2 size={14} className="mr-1" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
