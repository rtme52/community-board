'use client'

import { useState } from 'react'
import { Button, Textarea } from '@/components/ui'
import { Send, User as UserIcon, Shield } from 'lucide-react'

// Shared component for both Admin and User to view thread and reply
// We pass the submitAction as a prop so we can reuse this logic
export default function TicketDetail({
    ticket,
    replies,
    currentUserEmail,
    onReply,
    isAdminView = false
}: {
    ticket: any,
    replies: any[],
    currentUserEmail?: string,
    onReply: (message: string) => Promise<{ success?: boolean, error?: string }>,
    isAdminView?: boolean
}) {
    const [newMessage, setNewMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setIsSubmitting(true)
        const result = await onReply(newMessage)
        setIsSubmitting(false)

        if (result.success) {
            setNewMessage('')
            // Parent should re-fetch or we rely on revalidatePath which might not update client state immediately without router.refresh() 
            // Ideally parent handles refresh.
        } else {
            alert('Failed to send reply: ' + result.error)
        }
    }

    return (
        <div className="flex flex-col h-[600px] border border-stone-800 rounded-xl bg-stone-900/50 overflow-hidden">
            {/* Ticket Header */}
            <div className={`p-4 border-b border-stone-800 ${isAdminView ? 'bg-stone-900' : 'bg-stone-950'}`}>
                <h3 className="font-serif font-bold text-stone-100 text-lg">{ticket.name}</h3>
                <div className="text-sm text-stone-400">{ticket.email}</div>
                <div className="mt-2 p-3 bg-stone-800/50 rounded-lg text-stone-300 text-sm whitespace-pre-wrap">
                    {ticket.message}
                </div>
                <div className="mt-2 text-xs text-stone-500">
                    Ticket ID: #{ticket.id} • {new Date(ticket.created_at).toLocaleString()}
                </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {replies.length === 0 && (
                    <div className="text-center text-stone-600 text-sm italic py-8">
                        No replies yet.
                    </div>
                )}

                {replies.map((reply) => {
                    const isMe = isAdminView ? reply.is_admin_reply : !reply.is_admin_reply
                    return (
                        <div key={reply.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] rounded-lg p-3 text-sm ${isMe
                                    ? 'bg-blue-900/30 text-blue-100 border border-blue-900/50'
                                    : 'bg-stone-800 text-stone-300 border border-stone-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                                    {reply.is_admin_reply ? (
                                        <div className="flex items-center gap-1 text-island-gold-400">
                                            <Shield size={10} /> Support
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <UserIcon size={10} /> {ticket.name.split(' ')[0]}
                                        </div>
                                    )}
                                    <span>•</span>
                                    <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="whitespace-pre-wrap">{reply.message}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-stone-800 bg-stone-900/50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                        placeholder="Type your reply..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit(e)
                            }
                        }}
                        className="min-h-[50px] max-h-[150px] resize-none"
                    />
                    <Button type="submit" size="icon" disabled={isSubmitting || !newMessage.trim()}>
                        <Send size={18} />
                    </Button>
                </form>
            </div>
        </div>
    )
}
