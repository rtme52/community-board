import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { ADMIN_EMAILS } from './admin-config'


export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100">
            <header className="border-b border-stone-800 bg-stone-900/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-serif text-xl font-bold hover:text-stone-300 transition-colors">
                            ← Back to Site
                        </Link>
                        <span className="h-6 w-px bg-stone-800"></span>
                        <h1 className="font-sans font-semibold text-stone-300">Admin Dashboard</h1>
                    </div>
                    <div className="text-sm text-stone-500">
                        {user.email}
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
