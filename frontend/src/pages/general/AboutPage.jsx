const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6 font-['Plus_Jakarta_Sans']">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Reimagining <span className="text-[#FF5E00]">Food Delivery</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Vindu is more than just an app. We're building the world's first social food network.
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            We believe that food is the ultimate connector. It brings people together, sparks conversations, and creates memories.
                            Our mission is to transform the solitary act of ordering food into a shared, social experience. With Vindu,
                            you're not just getting a meal; you're joining a community of food lovers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Founded in 2026, Vindu Technologies Pvt. Ltd. set out to solve the "what should we eat?" dilemma by adding a social layer to food discovery.
                            We empower local restaurants, support reliable delivery partners, and give users a platform to share their culinary adventures.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
