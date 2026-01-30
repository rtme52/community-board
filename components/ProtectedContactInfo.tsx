'use client'

import { useState } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ShieldCheck, Eye } from 'lucide-react'
import { Button } from './ui'

export default function ProtectedContactInfo({ children }: { children: React.ReactNode }) {
    const [isVerified, setIsVerified] = useState(false)
    const [showCaptcha, setShowCaptcha] = useState(false)
    const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY

    const onVerify = (token: string) => {
        if (token) {
            setIsVerified(true)
        }
    }

    if (isVerified) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                {children}
            </div>
        )
    }

    if (!showCaptcha) {
        return (
            <div className="flex justify-center py-4 border-t border-stone-800/50">
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowCaptcha(true)
                    }}
                    className="gap-2 bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 hover:border-stone-700 transition-all shadow-sm"
                >
                    <Eye size={16} />
                    <span>Show Contact Info</span>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-stone-900/50 rounded-xl border border-stone-800/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-4 text-stone-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-medium">Security Check</span>
            </div>

            <div className="min-h-[78px] flex justify-center w-full">
                {siteKey ? (
                    <HCaptcha
                        sitekey={siteKey}
                        onVerify={onVerify}
                        theme="dark"
                        reCaptchaCompat={false}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-red-400 text-xs bg-red-950/20 p-3 rounded border border-red-900/50">
                        <span className="font-bold">Configuration Error</span>
                        <span>Missing NEXT_PUBLIC_HCAPTCHA_SITE_KEY</span>
                    </div>
                )}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setShowCaptcha(false)
                }}
                className="mt-4 text-xs text-stone-500 hover:text-stone-300 hover:underline transition-colors"
            >
                Cancel
            </button>
        </div>
    )
}
