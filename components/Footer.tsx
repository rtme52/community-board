'use client'

import Link from 'next/link'
import { useState } from 'react'
import ContactModal from './ContactModal'

export default function Footer({ user }: { user: any }) {
    const [isContactOpen, setIsContactOpen] = useState(false)

    return (
        <>
            <footer className="border-t border-stone-800 bg-stone-950/50 py-8 mt-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
                    <div>
                        <span className="font-serif text-stone-300">Guemes Services</span>
                        <span className="mx-2">•</span>
                        <span>© {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:text-stone-300 transition-colors">About</Link>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="hover:text-stone-300 transition-colors"
                        >
                            Contact Support
                        </button>
                        <Link href="/guidelines" className="hover:text-stone-300 transition-colors">Community Guidelines</Link>
                    </div>
                </div>
            </footer>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} user={user} />
        </>
    )
}
