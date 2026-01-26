
import CreateListingForm from './form'

export default function CreateListingPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-serif font-bold text-stone-100">Create New Listing</h1>
            <div className="rounded-lg border border-stone-800 bg-stone-900 p-6 shadow-sm">
                <CreateListingForm />
            </div>
        </div>
    )
}
