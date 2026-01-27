
import Feed from '@/components/Feed'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-stone-100">Listings (Currently In Development)</h1>
        {user ? (
          <Link href="/create">
            <Button className="bg-stone-900 text-white hover:bg-stone-800">
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
