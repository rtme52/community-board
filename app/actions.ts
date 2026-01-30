'use server'

import { createClient } from '@/utils/supabase/server'

export async function sendSupportEmail(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'All fields are required' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    const user_id = user?.id

    const { error } = await supabase
        .from('support_tickets')
        .insert({
            name,
            email,
            message,
            user_id
        })

    if (error) {
        console.error('Error submitting ticket:', error)
        return { error: 'Failed to submit ticket' }
    }

    return { success: true }
}
