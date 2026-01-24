import React from 'react';

const HelpPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6 font-['Plus_Jakarta_Sans']">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-4">
                        Help & <span className="text-[#FF5E00]">Support</span>
                    </h1>
                    <p className="text-gray-400">
                        Need assistance? We're here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#FF5E00]/50 transition-colors">
                        <div className="text-3xl mb-4">❓</div>
                        <h3 className="text-xl font-bold text-white mb-2">FAQs</h3>
                        <p className="text-sm text-gray-500">Find answers to common questions about orders and payments.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#FF5E00]/50 transition-colors">
                        <div className="text-3xl mb-4">🎧</div>
                        <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500">Chat with our support team in real-time for immediate help.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#FF5E00]/50 transition-colors">
                        <div className="text-3xl mb-4">✉️</div>
                        <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                        <p className="text-sm text-gray-500">Send us an email at support@vindu.com for complex issues.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Common Topics</h2>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                <span>Where is my order?</span>
                            </li>
                            <li className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                <span>How do I cancel my subscription?</span>
                            </li>
                            <li className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                <span>I received the wrong item. What should I do?</span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
