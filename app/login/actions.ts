'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in a real app, use Zod for validation
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            // Determine the redirect URL based on environment
            // In production, we want https://guemes.services
            // In dev, we want http://localhost:3000
            const siteUrl = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://guemes.services'

    const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                        emailRedirectTo: `${siteUrl}/auth/callback`,
                    },
                })

    if(error) {
                return { error: error.message }
            }

    // If auto-confirm is enabled (local dev usually), user is logged in.
    if(data.user && data.session) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
            })
        
        if (profileError) {
        console.error('Error creating profile:', profileError)
    }

    revalidatePath('/', 'layout')
    redirect('/')
} else {
    // If no session, it means email confirmation is required.
    // Return a success flag to the UI does NOT redirect.
    return { success: true }
}
}
