export default function AdminStats({ totalUsers, totalListings }: { totalUsers: number, totalListings: number }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-xl border border-stone-800 bg-stone-900 shadow-sm flex flex-col items-center">
                <span className="text-4xl font-bold text-stone-100 font-serif">{totalUsers}</span>
                <span className="text-sm text-stone-400 mt-1 uppercase tracking-wider font-medium">Total Users</span>
            </div>
            <div className="p-6 rounded-xl border border-stone-800 bg-stone-900 shadow-sm flex flex-col items-center">
                <span className="text-4xl font-bold text-island-gold-500 font-serif">{totalListings}</span>
                <span className="text-sm text-stone-400 mt-1 uppercase tracking-wider font-medium">Active Listings</span>
            </div>
        </div>
    )
}
