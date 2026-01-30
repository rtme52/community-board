'use client'

import { useState } from 'react'
import { updatePassword } from '../../login/actions'
import { Button, Input, Label } from '@/components/ui'

export default function UpdatePasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await updatePassword(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect handled in action
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-stone-800 bg-stone-900 p-6 shadow-sm">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-serif font-bold tracking-tight text-stone-100">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-sm text-stone-400">
                        Enter your new password below
                    </p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="mt-1"
                            />
                        </div>
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
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
