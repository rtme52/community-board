export default function GuidelinesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-stone-100 mb-8">Community Guidelines</h1>

            <div className="space-y-8 text-stone-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-serif font-bold text-stone-100 mb-4 flex items-center gap-3">
                        <span className="text-island-gold-500">01.</span> Be Kind & Respectful
                    </h2>
                    <p>
                        We are a small community. Treat every interaction with the same courtesy you would extend
                        to a neighbor you met at the ferry landing.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-stone-100 mb-4 flex items-center gap-3">
                        <span className="text-island-gold-500">02.</span> Verify Before You Hire
                    </h2>
                    <p>
                        Guemes Services connects neighbors, but please verify listings.
                        Always ask for references, clarify rates upfront, and ensure you feel comfortable before inviting someone to your home.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-stone-100 mb-4 flex items-center gap-3">
                        <span className="text-island-gold-500">03.</span> Keep it Local
                    </h2>
                    <p>
                        This board is intended for services and requests relevant to Guemes Island residents.
                        Please refrain from political campaigning, or off-island commercial spam.
                    </p>
                </section>

                <section className="bg-stone-900/50 p-6 rounded-lg border border-stone-800 mt-8">
                    <h3 className="font-bold text-stone-100 mb-2">See something wrong?</h3>
                    <p className="text-sm">
                        If you see a post that violates these guidelines, please use the "Contact Support" link in the footer immediately.
                    </p>
                </section>
            </div>
        </div>
    )
}
