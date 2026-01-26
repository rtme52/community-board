'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteListing(listingId: number) {
    const supabase = await createClient()

    // RLS will handle the permission check, but good to check user exists
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
}

export async function updateListing(listingId: number, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string

    const { error } = await supabase
        .from('listings')
        .update({ title, category, content })
        .eq('id', listingId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    redirect('/')
}
