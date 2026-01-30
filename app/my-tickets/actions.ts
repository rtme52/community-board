'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserTickets() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthorized')

        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return { data }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getUserTicketDetails(id: number) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthorized')

        // Verify ownership
        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (ticketError) throw ticketError
        if (!ticket) throw new Error('Ticket not found or unauthorized')

        const { data: replies, error: repliesError } = await supabase
            .from('ticket_replies')
            .select('*')
            .eq('ticket_id', id)
            .order('created_at', { ascending: true })

        if (repliesError) throw repliesError

        return { data: { ticket, replies } }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function replyAsUser(ticketId: number, message: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Unauthorized')

        // Verify ownership first
        const { data: ticket } = await supabase
            .from('support_tickets')
            .select('id')
            .eq('id', ticketId)
            .eq('user_id', user.id)
            .single()

        if (!ticket) throw new Error('Ticket not found or unauthorized')

        const { error } = await supabase
            .from('ticket_replies')
            .insert({
                ticket_id: ticketId,
                user_id: user.id,
                message,
                is_admin_reply: false
            })

        if (error) throw error

        revalidatePath('/my-tickets')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
