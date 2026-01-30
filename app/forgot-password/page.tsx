'use client'

import { useState } from 'react'
import { resetPassword } from '../login/actions'
import { Button, Input, Label } from '@/components/ui'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await resetPassword(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccessMessage("Check your email for a password reset link.")
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-stone-800 bg-stone-900 p-6 shadow-sm">

                {successMessage ? (
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-stone-100">Check your email</h2>
                        <p className="text-stone-400">{successMessage}</p>
                        <Link href="/login">
                            <Button className="w-full" variant="outline">Back to Sign In</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-serif font-bold tracking-tight text-stone-100">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-sm text-stone-400">
                                Enter your email to receive a reset link
                            </p>
                        </div>

                        <form action={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center">
                                <Link href="/login" className="text-sm font-medium text-stone-400 hover:text-stone-200 hover:underline">
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
