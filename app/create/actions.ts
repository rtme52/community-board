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

    // Check Ban Status
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_banned, banned_until')
        .eq('id', user.id)
        .single()

    if (profile?.is_banned) {
        if (profile.banned_until) {
            const until = new Date(profile.banned_until)
            if (until > new Date()) {
                return { error: `Your account is suspended until ${until.toLocaleDateString()} ${until.toLocaleTimeString()}` }
            } else {
                // Ban expired, ideally unban user here or just allow access?
                // For cleanliness, we should probably unban them or just allow.
                // Let's just allow for now, checking expiry is enough.
            }
        } else {
            return { error: 'Your account has been permanently suspended.' }
        }
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

    if (!title || !category || !content) {
        return { error: 'All fields are required' }
    }

    let image_url = null
    if (imageFile && imageFile.size > 0) {
        // Upload image
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            // We can choose to fail or continue without image. Let's continue but maybe log it?
            // Ideally return error to user.
            return { error: "Failed to upload image: " + uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName)

        image_url = publicUrl
    }

    const { error } = await supabase.from('listings').insert({
        user_id: user.id,
        title,
        category,
        content,
        contact_phone,
        contact_email,
        contact_via_call,
        contact_via_text,
        contact_via_email,
        image_url
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    redirect('/')
}
