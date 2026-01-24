import React from 'react';

const CookiesPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6 font-['Plus_Jakarta_Sans']">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
                    Cookie <span className="text-[#FF5E00]">Policy</span>
                </h1>

                <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. What are Cookies?</h2>
                        <p>
                            Cookies are small text files that are stored on your device when you visit a website. They help us remember your usage preferences
                            and improve your experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. How We Use Cookies</h2>
                        <p>
                            We use cookies to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Keep you signed in</li>
                            <li>Remember your preferences</li>
                            <li>Analyze how our services are used</li>
                            <li>Personalize content and ads</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Managing Cookies</h2>
                        <p>
                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites
                            to set cookies, you may worsen your overall user experience.
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

export default CookiesPage;
