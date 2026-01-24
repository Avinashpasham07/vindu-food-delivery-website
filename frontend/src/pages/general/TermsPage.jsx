import React from 'react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6 font-['Plus_Jakarta_Sans']">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
                    Terms & <span className="text-[#FF5E00]">Conditions</span>
                </h1>

                <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>
                            Welcome to Vindu. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
                            Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. User Accounts</h2>
                        <p>
                            To use certain features of the service, you must create an account. You are responsible for maintaining the confidentiality
                            of your account and password and for restricting access to your computer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Orders and Payments</h2>
                        <p>
                            When you place an order, you agree that all details you provide to us are accurate and complete. All prices are subject to change without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Content and Conduct</h2>
                        <p>
                            Users are responsible for any content they post, including reviews and photos. We reserve the right to remove content
                            that violates our community guidelines.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Limitation of Liability</h2>
                        <p>
                            Vindu shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from
                            your use of or inability to use the service.
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

export default TermsPage;
