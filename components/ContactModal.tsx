'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, Send } from 'lucide-react'
import { Button, Input, Textarea, Label } from './ui'
import { sendSupportEmail } from '@/app/actions'

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    if (!isOpen) return null

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        await sendSupportEmail(formData)
        setIsSubmitting(false)
        setIsSuccess(true)

        // Auto close after success
        setTimeout(() => {
            onClose()
            setIsSuccess(false) // Reset for next time
        }, 2000)
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-stone-950 border border-stone-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900/50">
                    <h3 className="font-serif font-bold text-stone-100">Contact Support</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                <Send size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-stone-100">Message Sent!</h4>
                            <p className="text-stone-400">Thanks for reaching out. We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="Your name" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="How can we help?"
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
