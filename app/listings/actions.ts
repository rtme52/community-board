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
    const contact_phone = formData.get('contact_phone') as string
    const contact_email = formData.get('contact_email') as string
    const contact_via_call = formData.get('contact_via_call') === 'on'
    const contact_via_text = formData.get('contact_via_text') === 'on'
    const contact_via_email = formData.get('contact_via_email') === 'on'
    const imageFile = formData.get('image') as File

    const updates: any = {
        title,
        category,
        content,
        contact_phone,
        contact_email,
        contact_via_call,
        contact_via_text,
        contact_via_email
    }

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(fileName, imageFile)

        if (uploadError) {
            return { error: "Failed to upload image: " + uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName)

        updates.image_url = publicUrl
    }

    const { error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', listingId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    redirect('/')
}
