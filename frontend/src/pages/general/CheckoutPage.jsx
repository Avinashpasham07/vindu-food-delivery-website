import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useSquad } from '../../context/SquadContext';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/client';

const CheckoutPage = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { sharedCart, roomId, socket, leaveSquad, squadMembers } = useSquad(); // Get Squad Data
    const navigate = useNavigate();
    const location = useLocation();
    const squadAmt = location.state?.squadAmt;

    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
    const [isLocating, setIsLocating] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);
    const isOrderPlaced = React.useRef(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    // Determine which cart to use (Squad vs Local)
    const finalCart = roomId
        ? sharedCart.filter(item => (item.split?.[socket?.id] || 0) > 0).map(item => ({
            ...item,
            quantity: item.split[socket.id] // Override quantity with user's specific share
        }))
        : cart;

    // Totals
    // Calculate squad share if in a room
    const mySquadShare = roomId
        ? sharedCart.reduce((total, item) => total + (item.price * (item.split?.[socket?.id] || 0)), 0)
        : 0;

    // Totals
    const itemTotal = roomId ? (mySquadShare > 0 ? mySquadShare : squadAmt || 0) : cartTotal;
    const taxes = Math.round(itemTotal * 0.05);
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const grandTotal = itemTotal + taxes + deliveryFee;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Using OpenStreetMap Nominatim API for reverse geocoding (Free, no key needed)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;
                        // Prioritize village/hamlet over neighbourhood (colonies)
                        const localArea = addr.village || addr.hamlet || addr.neighbourhood || addr.suburb || addr.city_district || '';

                        setFormData(prev => ({
                            ...prev,
                            address: `${addr.road || ''} ${addr.house_number || ''}, ${localArea}`.trim(),
                            city: addr.city || addr.town || addr.municipality || '',
                            zip: addr.postcode || ''
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                    alert('Could not fetch address details. Please enter manually.');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let msg = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        msg = 'Location permission denied. Please enable it in browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        msg = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        msg = 'Location request timed out. Please try again.';
                        break;
                    default:
                        msg = 'An unknown error occurred.';
                }
                alert(msg);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handlePlaceOrder = async () => {
        // Validation
        if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.zip) {
            alert('Please fill in all delivery details');
            return;
        }

        setIsPlacingOrder(true);

        try {
            // Try to get token for header, but rely on cookies if missing
            let token = localStorage.getItem('token');
            if (token === 'undefined') token = null;

            const orderData = {
                items: finalCart.map(item => ({
                    foodId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    // Cart uses item.video for media URL regardless of type
                    image: item.fileType === 'image' ? item.video : (item.image || ''),
                    video: item.fileType === 'video' ? item.video : ''
                })),
                totalAmount: grandTotal,
                address: formData,
                paymentMethod: paymentMethod
            };

            // Use apiClient which sends cookies automatically. Also send header if we have token.
            const response = await apiClient.post('/orders/place', orderData, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.status === 201) {
                isOrderPlaced.current = true;
                setPlacedOrderId(response.data.order._id);
                setStep(3);
                clearCart();
                // Navigate to tracking directly
                navigate(`/order/tracking/${response.data.order._id}`);
            }
        } catch (error) {
            console.error('Order placement failed:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to place order';
            alert(`Error (${error.response?.status || 'Unknown'}): ${msg}`);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    React.useEffect(() => {
        if (finalCart.length === 0 && !isOrderPlaced.current && step !== 3) {
            navigate('/cart');
        }
    }, [finalCart, step, navigate]);

    if (finalCart.length === 0 && step !== 3) return null;

    if (step === 3) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center font-['Plus_Jakarta_Sans'] relative overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/20 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="relative z-10 bg-[#111]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[40px] shadow-2xl max-w-md w-full animate-fade-in-up">
                    <div className="w-24 h-24 bg-[#10B981] rounded-full flex items-center justify-center mb-8 mx-auto shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-10 h-10 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Order Placed!</h1>
                    <p className="text-gray-400 mb-10 text-lg">Your food is being prepared with love.<br />Estimated delivery: <span className="text-white font-bold">35 mins</span></p>
                    {roomId ? (
                        <div className="space-y-3 w-full">
                            <button
                                onClick={() => {
                                    leaveSquad();
                                    navigate(`/order/tracking/${placedOrderId}`);
                                }}
                                className="w-full py-4 bg-[#FF5E00] hover:bg-[#ff7b29] rounded-2xl font-bold transition-all text-white text-lg hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
                            >
                                Track Live Order 📍
                            </button>
                            <button
                                onClick={() => {
                                    leaveSquad();
                                    navigate('/');
                                }}
                                className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors"
                            >
                                Leave Squad & Go Home
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 w-full">
                            <button
                                onClick={() => navigate(`/order/tracking/${placedOrderId}`)}
                                className="w-full py-4 bg-[#FF5E00] hover:bg-[#ff7b29] rounded-2xl font-bold transition-all text-white text-lg hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
                            >
                                Track Live Order 📍
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] pb-32 relative overflow-x-hidden">

            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5E00]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5E00]/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-10 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-6 mb-12 animate-fade-in">
                    <button onClick={() => navigate(-1)} className="group p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-8 animate-slide-up">

                        {/* Section 1: Address */}
                        <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-colors duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-[#FF5E00] flex items-center justify-center text-sm font-black shadow-lg shadow-[#FF5E00]/20">1</span>
                                    Delivery Details
                                </h3>
                                <button
                                    onClick={handleUseLocation}
                                    disabled={isLocating}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#FF5E00]/10 hover:bg-[#FF5E00]/20 text-[#FF5E00] text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLocating ? (
                                        <div className="w-4 h-4 border-2 border-[#FF5E00] border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {isLocating ? 'Locating...' : 'Use Current Location'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    icon={<UserIcon />}
                                />
                                <FormInput
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    icon={<PhoneIcon />}
                                />
                                <div className="md:col-span-2">
                                    <FormInput
                                        name="address"
                                        placeholder="Street Address / Flat No"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        icon={<MapPinIcon />}
                                    />
                                </div>
                                <FormInput
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                                <FormInput
                                    name="zip"
                                    placeholder="ZIP Code"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Section 2: Payment */}
                        <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-colors duration-300" style={{ animationDelay: '100ms' }}>
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
                                <span className="w-10 h-10 rounded-full bg-[#FF5E00] flex items-center justify-center text-sm font-black shadow-lg shadow-[#FF5E00]/20">2</span>
                                Payment Method
                            </h3>

                            <div className="space-y-4">
                                <PaymentOption
                                    id="card"
                                    title="Credit / Debit Card"
                                    desc="Secure payment via Stripe"
                                    selected={paymentMethod}
                                    setSelected={setPaymentMethod}
                                    icon={<CreditCardIcon />}
                                />
                                <PaymentOption
                                    id="upi"
                                    title="UPI"
                                    desc="Google Pay, PhonePe, Paytm"
                                    selected={paymentMethod}
                                    setSelected={setPaymentMethod}
                                    icon={<UpiIcon />}
                                />
                                <PaymentOption
                                    id="cod"
                                    title="Cash on Delivery"
                                    desc="Pay when you receive"
                                    selected={paymentMethod}
                                    setSelected={setPaymentMethod}
                                    icon={<CashIcon />}
                                />
                            </div>
                        </div>

                        {/* Squad Bill Breakdown Section */}
                        {roomId && (
                            <div className="mt-8 bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-4 text-white">
                                    <span className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-sm font-black shadow-lg shadow-[#8B5CF6]/20">3</span>
                                    Squad Bill Split
                                </h3>

                                <div className="space-y-4">
                                    {squadMembers?.map((member) => {
                                        const memberItems = sharedCart.filter(item => (item.split?.[member.id] || 0) > 0);
                                        const memberTotal = memberItems.reduce((total, item) => total + (item.price * (item.split?.[member.id] || 0)), 0);
                                        const isMe = member.id === socket?.id;

                                        return (
                                            <div key={member.id} className={`p-4 rounded-xl border transition-all ${isMe ? 'bg-[#FF5E00]/10 border-[#FF5E00]/50' : 'bg-white/5 border-white/5'}`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${member.avatar ? '' : (isMe ? 'bg-[#FF5E00]' : 'bg-gray-700')}`}>
                                                            {member.avatar ? <img src={member.avatar} className="w-full h-full rounded-full object-cover" /> : member.name[0]}
                                                        </div>
                                                        <div>
                                                            <span className={`text-sm font-bold ${isMe ? 'text-white' : 'text-gray-300'}`}>{member.name} {isMe && '(You)'}</span>
                                                            <span className="block text-[10px] text-gray-500 uppercase tracking-wider">{isMe ? 'Paying Now' : 'Pending'}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-lg font-bold text-white">₹{memberTotal}</span>
                                                </div>

                                                {memberItems.length > 0 && (
                                                    <div className="pl-11 text-sm space-y-1">
                                                        {memberItems.map(item => (
                                                            <div key={item._id} className="flex justify-between text-gray-400">
                                                                <span>{item.split[member.id]}x {item.name}</span>
                                                                <span>₹{item.price * item.split[member.id]}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sticky top-24 animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '200ms' }}>

                            {/* Gradient Top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5E00] to-[#ff9e66]"></div>

                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-extrabold text-2xl">Order Summary</h3>
                                {squadAmt && (
                                    <span className="bg-[#FF5E00] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Squad Share
                                    </span>
                                )}
                            </div>

                            {/* Cart Mini List with Scroll if too long */}
                            <div className="space-y-4 mb-8 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {finalCart.map(item => (
                                    <div key={item._id} className="flex justify-between items-center text-sm group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0 overflow-hidden">
                                                {item.fileType === 'image' ? (
                                                    <img src={item.video} className="w-full h-full object-cover" />
                                                ) : (
                                                    <video src={item.video} className="w-full h-full object-cover" muted />
                                                )}
                                            </div>
                                            <span className="text-gray-300 truncate font-medium group-hover:text-white transition-colors">
                                                <span className="text-[#FF5E00] font-bold mr-1">{item.quantity}x</span>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-white font-bold ml-2">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/10 my-6"></div>

                            <div className="space-y-4 text-sm font-medium text-gray-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{itemTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-white">₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes</span>
                                    <span className="text-white">₹{taxes}</span>
                                </div>
                                <div className="flex justify-between items-end text-white pt-4 border-t border-white/10 mt-2">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-black text-[#FF5E00]">₹{grandTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full mt-8 bg-gradient-to-r from-[#FF5E00] to-[#ff7b29] hover:from-[#ff4500] hover:to-[#ff5e00] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] group flex justify-center items-center gap-2 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay & Place Order
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex justify-center items-center gap-2 opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-500">
                                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SSL Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

// --- Helper Components for clean code ---

const FormInput = ({ name, placeholder, value, onChange, icon }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5E00] transition-colors">
            {icon}
        </div>
        <input
            type="text"
            name={name}
            placeholder={placeholder}
            className={`w-full bg-[#050505] border border-white/10 rounded-2xl p-4 ${icon ? 'pl-12' : 'pl-6'} text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600`}
            value={value}
            onChange={onChange}
        />
    </div>
);

const PaymentOption = ({ id, title, desc, selected, setSelected, icon }) => (
    <label
        className={`flex items-center gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 group
        ${selected === id
                ? 'bg-[#FF5E00]/10 border-[#FF5E00] shadow-[0_0_30px_rgba(255,94,0,0.1)]'
                : 'bg-[#1a1a1a]/50 border-white/5 hover:bg-[#1a1a1a] hover:border-white/20'
            }`}
    >
        <div className="relative">
            <input
                type="radio"
                name="payment"
                value={id}
                checked={selected === id}
                onChange={() => setSelected(id)}
                className="peer sr-only"
            />
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selected === id ? 'border-[#FF5E00] bg-[#FF5E00]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
        </div>

        <div className={`p-3 rounded-xl transition-colors ${selected === id ? 'bg-[#FF5E00] text-white' : 'bg-[#222] text-gray-400'}`}>
            {icon}
        </div>

        <div className="flex-1">
            <span className={`font-bold block text-lg ${selected === id ? 'text-white' : 'text-gray-300'}`}>{title}</span>
            <span className="text-sm text-gray-500">{desc}</span>
        </div>
    </label>
);

// Icons
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>;
const UpiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default CheckoutPage;
