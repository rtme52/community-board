'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button, Input, Label } from '@/components/ui'
import Link from 'next/link'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        // Validate
        const email = formData.get('email')
        const password = formData.get('password')
        const fullName = formData.get('fullName')

        if (!email || !password) {
            setError('Email and password are required')
            setLoading(false)
            return
        }

        if (!isLogin && !fullName) {
            setError('Real Name is required for sign up')
            setLoading(false)
            return
        }

        const action = isLogin ? login : signup
        const result = await action(formData) as any

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            // Handle success state (verification needed)
            setSuccessMessage("Please check your email to verify your account.")
            setLoading(false)
        }
    }

    if (successMessage) {
        return (
            <div className="w-full max-w-md space-y-8 rounded-lg border border-stone-800 bg-stone-900 p-8 shadow-sm text-center">
                <h2 className="text-2xl font-serif font-bold text-stone-100">Check your email</h2>
                <p className="mt-4 text-stone-400">
                    {successMessage}
                </p>
                <p className="mt-2 text-sm text-stone-500">
                    Click the link in the email to activate your account.
                </p>
                <Button
                    variant="outline"
                    className="mt-6 w-full border-stone-700 text-stone-300 hover:text-stone-100 hover:bg-stone-800"
                    onClick={() => {
                        setSuccessMessage(null)
                        setIsLogin(true)
                    }}
                >
                    Back to Sign In
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md space-y-8 rounded-lg border border-stone-800 bg-stone-900 p-6 shadow-sm">
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-serif font-bold tracking-tight text-stone-100">
                    {isLogin ? 'Welcome back' : 'Join the community'}
                </h2>
                <p className="mt-2 text-sm text-stone-400">
                    {isLogin ? 'Sign in to manage your listings' : 'Create an account to post'}
                </p>
            </div>

            <form action={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    {!isLogin && (
                        <div>
                            <Label htmlFor="fullName">Real Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                placeholder="John Doe"
                                className="mt-1"
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="you@example.com"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {isLogin && (
                                <Link href="/forgot-password" className="text-xs text-stone-400 hover:text-stone-200">
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1"
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-600">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                </Button>
            </form>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin)
                        setError(null)
                    }}
                    className="text-sm font-medium text-stone-400 hover:text-stone-200 hover:underline"
                >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
    )
}
