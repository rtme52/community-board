
import Feed from '@/components/Feed'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-bold text-stone-100">Local Islander Services</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-island-gold-500/10 border border-island-gold-500/20 text-island-gold-500 rounded-full">Beta</span>
          </div>
          <p className="text-stone-400 max-w-lg text-sm leading-relaxed">
            Welcome to your island hub.
            <span className="text-stone-300"> Looking for help?</span> Browse the services below.
            <span className="text-stone-300"> Offering skills?</span> Post a listing to let neighbors know.
          </p>
        </div>
        {user ? (
          <Link href="/create">
            <Button className="bg-stone-100 text-stone-950 hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.1)] font-medium transition-all hover:scale-105">
              + Post Listing
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="text-stone-300 border-stone-600 hover:text-stone-100">
              Login to Post
            </Button>
          </Link>
        )}
      </div>

      <Feed />
    </div>
  )
}
