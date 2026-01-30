'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized: Please log in')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        throw new Error('Unauthorized: Admin access required')
    }
    return user
}

export async function openAdminTicket(userId: string, initialMessage: string) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        // Create the ticket
        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .insert({
                user_id: userId,
                name: 'Admin Support',
                email: 'support@guemes.services', // Placeholder as profiles don't expose email publicly/easily here
                message: initialMessage,
                status: 'open'
            })
            .select()
            .single()

        if (ticketError) throw ticketError

        // We could also insert a first reply if we wanted the message to be in replies, 
        // but the ticket itself has a 'message' field which acts as the thread starter.
        // Doing both might be redundant unless we want to normalize.
        // For now, the 'message' column is the starter.

        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
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

export async function toggleAdminVisibility(id: number, currentHiddenStatus: boolean) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('listings')
            .update({ is_admin_hidden: !currentHiddenStatus })
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

export async function getAdminStats() {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { count: listingCount, error: listingError } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })

        const { count: userCount, error: userError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        if (listingError) throw listingError
        if (userError) throw userError

        return {
            data: {
                totalListings: listingCount || 0,
                totalUsers: userCount || 0
            }
        }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getUsers() {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
        // .order('created_at', { ascending: false })

        if (error) throw error
        return { data }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function banUser(userId: string, permanent: boolean, durationHours?: number) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const updates: any = { is_banned: true }

        if (permanent) {
            updates.banned_until = null // Null means forever in this logic if is_banned is true
        } else if (durationHours) {
            const until = new Date()
            until.setHours(until.getHours() + durationHours)
            updates.banned_until = until.toISOString()
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function unbanUser(userId: string) {
    try {
        await checkAdmin()
        const supabase = await createClient()

        const { error } = await supabase
            .from('profiles')
            .update({ is_banned: false, banned_until: null })
            .eq('id', userId)

        if (error) throw error
        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
