'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { ADMIN_EMAILS } from './admin-config'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        throw new Error('Unauthorized: Admin access required')
    }
    return user
}

export async function getTickets() {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return { data }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function resolveTicket(id: number) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('support_tickets')
            .update({ status: 'resolved' })
            .eq('id', id)

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteTicket(id: number) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('support_tickets')
            .delete()
            .eq('id', id)

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getTicketDetails(id: number) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('id', id)
            .single()

        if (ticketError) throw ticketError

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

export async function replyToTicket(ticketId: number, message: string) {
    try {
        const user = await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('ticket_replies')
            .insert({
                ticket_id: ticketId,
                user_id: user.id,
                message,
                is_admin_reply: true
            })

        if (error) throw error

        // Also update ticket status to resolved or open depending on workflow?
        // Let's keep it simple for now, maybe mark as 'open' (if previously resolved) since there is new activity?

        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getAdminListings() {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false })

        if (error) throw error
        return { data }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function toggleListingVisibility(id: number, currentHiddenStatus: boolean) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('listings')
            .update({ is_hidden: !currentHiddenStatus })
            .eq('id', id)

        if (error) throw error
        revalidatePath('/admin')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteListingAdmin(id: number) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('listings')
            .delete()
            .eq('id', id)

        if (error) throw error
        revalidatePath('/admin')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
