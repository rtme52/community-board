
import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "flex h-10 w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 ring-offset-stone-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive'
    size?: 'default' | 'sm' | 'icon'
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
    const variants = {
        default: "bg-stone-50 text-stone-900 hover:bg-stone-200",
        outline: "border border-stone-700 bg-transparent hover:bg-stone-800 text-stone-300",
        ghost: "hover:bg-stone-800 hover:text-stone-100 text-stone-400",
        destructive: "bg-red-900 text-stone-100 hover:bg-red-950",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        icon: "h-9 w-9",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors ring-offset-stone-950",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                "text-sm font-medium leading-none text-stone-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        />
    )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 ring-offset-stone-950 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}
