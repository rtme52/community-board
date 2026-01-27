export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-stone-100 mb-8">About Guemes Services</h1>

            <div className="space-y-6 text-stone-300 leading-relaxed">
                <p className="text-lg">
                    Guemes Services is a community-driven initiative designed to connect islanders.
                    Whether you need a hand with a project, have a skill to share, or just help someone move some firewood,
                    this board is here to facilitate those connections.
                </p>

                <h2 className="text-2xl font-serif font-bold text-stone-100 mt-8 mb-4">Our Mission</h2>
                <p>
                    Living on an island means relying on your neighbors. Our goal is to make that reliance easier,
                    more transparent, and more accessible to everyone, from long-time residents to new arrivals.
                </p>

                <h2 className="text-2xl font-serif font-bold text-stone-100 mt-8 mb-4">How it Works</h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-island-gold-500">
                    <li><strong>Post a Service:</strong> Let the community know what you can do.</li>
                    <li><strong>Ask for Help:</strong> Don't be shy. If you need a hand, someone probably has the time.</li>
                    <li><strong>Connect Directly:</strong> We don't stand in the middle. Call, text, or email your neighbors directly.</li>
                </ul>
            </div>
        </div>
    )
}
