import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6 font-['Plus_Jakarta_Sans']">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
                    Privacy <span className="text-[#FF5E00]">Policy</span>
                </h1>

                <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as your name, email address, phone number, and delivery address
                            when you create an account or place an order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, to process your orders,
                            and to communicate with you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Information Sharing</h2>
                        <p>
                            We may share your information with restaurants and delivery partners to fulfill your orders. We do not sell your
                            personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information against unauthorized access,
                            alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <p className="text-xs text-gray-600 mt-12">
                        Last updated: January 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
