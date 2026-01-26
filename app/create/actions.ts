'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createListing(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to create a listing' }
    }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string

    if (!title || !category || !content) {
        return { error: 'All fields are required' }
    }

    const { error } = await supabase.from('listings').insert({
        user_id: user.id,
        title,
        category,
        content,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    redirect('/')
}
